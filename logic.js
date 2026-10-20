(function(root,factory){
  var api=factory();
  if(typeof module==="object"&&module.exports)module.exports=api;
  else root.TourLogic=api;
}(typeof self!=="undefined"?self:this,function(){
  var CFG={radiusM:120,maxAcc:60,staleM:250,maxWaitMs:15000,headingTolerance:70};

  function hav(a,b,c,d){
    var R=6371000,r=Math.PI/180,dl=(c-a)*r,dn=(d-b)*r;
    var x=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dn/2)*Math.sin(dn/2);
    return 2*R*Math.asin(Math.sqrt(x));
  }
  function estSeconds(text,rate){
    var words=String(text||"").trim().split(/\s+/).filter(Boolean).length;
    return words/(2.5*(rate||0.95));
  }
  function trigDist(speedMs,stop){
    var seconds=stop&&isFinite(stop.duration)?stop.duration:estSeconds(stop&&stop.text,0.95);
    return Math.max(CFG.radiusM,(speedMs||0)*Math.min(seconds*0.5,40));
  }
  function normaliseDegrees(n){return (n%360+360)%360;}
  function bearing(a,b,c,d){
    var r=Math.PI/180,y=Math.sin((d-b)*r)*Math.cos(c*r);
    var x=Math.cos(a*r)*Math.sin(c*r)-Math.sin(a*r)*Math.cos(c*r)*Math.cos((d-b)*r);
    return normaliseDegrees(Math.atan2(y,x)/r);
  }
  function headingAllowed(pos,stop,tolerance){
    if(pos.heading==null||!isFinite(pos.heading))return true;
    var target=bearing(pos.lat,pos.lon,stop.lat,stop.lon);
    var delta=Math.abs(normaliseDegrees(target-pos.heading));
    if(delta>180)delta=360-delta;
    return delta<=(tolerance==null?CFG.headingTolerance:tolerance);
  }
  function accuracyOkay(accuracy,maxAcc){return isFinite(accuracy)&&accuracy<=(maxAcc||CFG.maxAcc);}
  function due(pos,played,queued,stops,checkHeading){
    var out=[];
    for(var i=0;i<(stops||[]).length;i++){
      var s=stops[i];
      if(s.manual||played[s.id]||queued[s.id])continue;
      if(checkHeading&&!headingAllowed(pos,s))continue;
      if(hav(pos.lat,pos.lon,s.lat,s.lon)<=trigDist(pos.speed,s))out.push(s.id);
    }
    return out;
  }
  function nextStop(stops,played){
    for(var i=0;i<(stops||[]).length;i++)if(!stops[i].manual&&!played[stops[i].id])return stops[i];
    return null;
  }
  function queueDrop(entry,pos,now){
    if(!entry||entry.manual)return false;
    if((now-entry.queuedAt)>CFG.maxWaitMs)return true;
    if(!pos||entry.lat==null)return false;
    var distance=hav(pos.lat,pos.lon,entry.lat,entry.lon);
    return distance>CFG.staleM&&entry.distanceIncreasing===true;
  }
  return {CFG:CFG,hav:hav,estSeconds:estSeconds,trigDist:trigDist,due:due,nextStop:nextStop,
    bearing:bearing,headingAllowed:headingAllowed,accuracyOkay:accuracyOkay,queueDrop:queueDrop};
}));
