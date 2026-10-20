import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root=path.resolve(import.meta.dirname,"..");
function envFile(){
  try{return Object.fromEntries(fs.readFileSync(path.join(root,".env"),"utf8").split(/\r?\n/).filter(line=>line.trim()&&!line.trim().startsWith("#")&&line.includes("=")).map(line=>{const at=line.indexOf("=");return [line.slice(0,at).trim(),line.slice(at+1).trim().replace(/^(['\"])(.*)\1$/,"$2")]}))}catch{return {}}
}
const args=process.argv.slice(2),dry=args.includes("--dry-run"),force=args.includes("--force");
const tourAt=args.indexOf("--tour"),wanted=tourAt>=0?args[tourAt+1]:null;
const index=JSON.parse(fs.readFileSync(path.join(root,"tours/index.json"),"utf8"));
let total=0;
const jobs=[];
for(const ref of index.tours){
  if(wanted&&ref.id!==wanted)continue;
  let tour;
  try{tour=JSON.parse(fs.readFileSync(path.join(root,ref.file),"utf8"))}catch{continue}
  if(!(tour.stops||[]).length)continue;
  for(const item of [tour.intro,...(tour.stops||[]),...(tour.extras||[])].filter(Boolean)){
    const output=path.join(root,"audio",tour.id,item.id+".mp3");
    if(!force&&fs.existsSync(output))continue;
    jobs.push({tour:tour.id,item,output});total+=item.text.length;
    if(dry)console.log(`${tour.id}/${item.id}: ${item.text.length} characters -> ${path.relative(root,output)}`);
  }
}
if(dry){console.log(`Total: ${jobs.length} items, ${total} characters`);process.exit(0)}
const env=envFile(),key=env.ELEVENLABS_API_KEY,voice=process.env.ELEVENLABS_VOICE_ID||env.ELEVENLABS_VOICE_ID;
if(!key||!voice)throw new Error("ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID are required");
for(let i=0;i<jobs.length;i++){
  const job=jobs[i];
  let response,body;
  for(let attempt=1;attempt<=4;attempt++){
    try{
      response=await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}`,{method:"POST",headers:{"xi-api-key":key,"Accept":"audio/mpeg","Content-Type":"application/json"},body:JSON.stringify({text:job.item.text,model_id:"eleven_multilingual_v2"}),signal:AbortSignal.timeout(60000)});
      if(!response.ok){console.error(`HTTP ${response.status}: ${await response.text()}`);process.exit(1)}
      body=Buffer.from(await response.arrayBuffer());break;
    }catch(e){
      console.error(`Network error on ${job.output} (attempt ${attempt}/4): ${e.cause&&e.cause.code||e.message}`);
      if(attempt===4)process.exit(1);
      await new Promise(resolve=>setTimeout(resolve,2000*attempt));
    }
  }
  fs.mkdirSync(path.dirname(job.output),{recursive:true});fs.writeFileSync(job.output,body);
  console.log(`Wrote ${path.relative(root,job.output)}`);
  if(i<jobs.length-1)await new Promise(resolve=>setTimeout(resolve,500));
}
