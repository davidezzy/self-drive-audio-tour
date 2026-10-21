const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const L=require("../logic.js");

test("trigger distance responds to speed and script length",()=>{
  assert.equal(L.trigDist(5,{text:"short words"}),100);
  assert.ok(L.trigDist(30,{text:Array(250).fill("word").join(" ")})>100);
  assert.equal(L.trigDist(20,{duration:100,text:"short"}),400);
});
test("due preserves route order and prevents repeats",()=>{
  const stops=[{id:"a",lat:0,lon:0,text:"a"},{id:"b",lat:0,lon:0.0001,text:"b"}];
  assert.deepEqual(L.due({lat:0,lon:0,speed:0},{},{},stops,false),["a","b"]);
  assert.deepEqual(L.due({lat:0,lon:0,speed:0},{a:true},{b:true},stops,false),[]);
});
test("queue drops a passed or overdue automatic stop",()=>{
  const now=20000,entry={queuedAt:19000,lat:0,lon:0,lastDistance:260,distanceIncreasing:true};
  assert.equal(L.queueDrop(entry,{lat:0,lon:0.003,speed:10},now),true);
  assert.equal(L.queueDrop({...entry,manual:true},{lat:0,lon:0.003},now),false);
  assert.equal(L.queueDrop({...entry,queuedAt:0,lastDistance:null},null,now),true);
});
test("accuracy helper rejects weak fixes",()=>{assert.equal(L.accuracyOkay(60),true);assert.equal(L.accuracyOkay(61),false)});
test("heading allows unknown and directions within 70 degrees",()=>{
  const stop={lat:1,lon:0};
  assert.equal(L.headingAllowed({lat:0,lon:0,heading:null},stop),true);
  assert.equal(L.headingAllowed({lat:0,lon:0,heading:65},stop),true);
  assert.equal(L.headingAllowed({lat:0,lon:0,heading:71},stop),false);
});
test("simulated Orange route fires each stop once in order",()=>{
  const tour=JSON.parse(fs.readFileSync("tours/orange.json","utf8")),played={},queued={},fired=[];
  for(const stop of tour.stops){
    for(const id of L.due({lat:stop.lat,lon:stop.lon,speed:11},played,queued,tour.stops,false)){played[id]=true;fired.push(id)}
  }
  assert.deepEqual(fired,tour.stops.map(s=>s.id));
});
test("nextStop handles an empty tour",()=>{assert.equal(L.nextStop([],{}),null)});
