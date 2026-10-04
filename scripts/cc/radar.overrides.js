// Keep every marker inside its labelled category wedge, regardless of event count.
// Radial distance continues to encode the event date.
function evPos(e,i,R,cx,cy){
 const ci=EV_ORDER.indexOf(e.c),same=EV.filter(x=>x.c===e.c),k=Math.max(0,same.indexOf(e));
 const fraction=same.length>1?.16+.68*k/(same.length-1):.5;
 const a=-Math.PI/2+(ci+fraction)*2*Math.PI/EV_ORDER.length;
 const r=Math.max(12,evR(e.days,R));
 return [cx+r*Math.cos(a),cy+r*Math.sin(a),a];
}
