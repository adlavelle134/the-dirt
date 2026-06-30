import { useEffect, useRef, useState } from 'react'

export default function CourseWalkthrough() {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const [caption, setCaption] = useState('THE DIRT')
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const handlePlayRef = useRef(null)
  const handleResetRef = useRef(null)

  function toggleFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (el.requestFullscreen) el.requestFullscreen()
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    } else {
      if (document.exitFullscreen) document.exitFullscreen()
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    }
  }

  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(!!(document.fullscreenElement || document.webkitFullscreenElement))
    }
    document.addEventListener('fullscreenchange', onFullscreenChange)
    document.addEventListener('webkitfullscreenchange', onFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    var W = 640, H = 220, GROUND = 170
    var BEAM_LIFT = 16

    var logs = [140,260,380,500].map(function(x){return {x:x,y:GROUND-BEAM_LIFT-14,w:34,h:14}})
    var sandbagX = 580
    var APPROACH = 36, CLEAR = 18
    var startX = 60
    var runBackX = logs[0].x - APPROACH - 30

    var rampStart = 760
    var rampUpLen = 90
    var rampHeight = 40
    var rampFlatLen = 80
    var rampPeakX1 = rampStart + rampUpLen
    var rampPeakX2 = rampPeakX1 + rampFlatLen
    var rampEnd = rampPeakX2 + rampUpLen
    var weight2X = rampStart - 50
    var dropX = rampEnd + 60

    var rampLogs = [
      {x1:rampStart, y1:GROUND, x2:rampPeakX1, y2:GROUND-rampHeight},
      {x1:rampPeakX1, y1:GROUND-rampHeight, x2:rampPeakX2, y2:GROUND-rampHeight},
      {x1:rampPeakX2, y1:GROUND-rampHeight, x2:rampEnd, y2:GROUND}
    ]

    function rampYAt(x){
      if(x <= rampStart) return GROUND
      if(x <= rampPeakX1) return GROUND - (x-rampStart)/rampUpLen*rampHeight
      if(x <= rampPeakX2) return GROUND - rampHeight
      if(x <= rampEnd) return GROUND - rampHeight + (x-rampPeakX2)/rampUpLen*rampHeight
      return GROUND
    }

    var peakStart = dropX + 90
    var peakSpacing = 55
    var peakHeights = [22,42,62,42,22]
    var vBeams = peakHeights.map(function(h,i){ return {x:peakStart+i*peakSpacing, h:h} })
    var peakEnd = vBeams[vBeams.length-1].x + 60

    var barX = peakEnd + 110
    var afterBarX = barX + 90

    var tireDiameter = 58
    var tireThickness = 30
    var tireStartX = afterBarX + 100
    var flipDist = tireDiameter + 16
    var tireApproachX = tireStartX - tireDiameter/2 - 30
    var tireFarSideX = tireStartX + flipDist + tireDiameter/2 + 30
    var afterTireX = tireStartX + 70

    var heaveStart = afterTireX + 60
    var throwDist = 85
    var numThrows = 3
    var heaveEnd = heaveStart + throwDist*numThrows
    var afterHeaveX = heaveEnd + 50

    var stumpStartX = afterHeaveX + 50
    var stumpCarryDist = throwDist*numThrows
    var stumpEndX = stumpStartX + stumpCarryDist
    var afterStumpX = stumpEndX + 50

    var haulSackX = afterStumpX + 50
    var wheelbarrowX = haulSackX + 80
    var stakesStartX = wheelbarrowX + 60
    var stakeSpacing = 50
    var numStakes = 5
    var stakeXs = []
    for(var si=0; si<numStakes; si++) stakeXs.push(stakesStartX + si*stakeSpacing)
    var stakesEndX = stakeXs[numStakes-1] + 40
    var afterHaulX = stakesEndX + 50

    var sledStartX = afterHaulX + 50
    var sledPullDist = throwDist*numThrows
    var sledEndX = sledStartX + sledPullDist
    var afterSledX = sledEndX + 50

    var handStart = afterSledX + 60
    var ropeLength = 100
    var blockStartX = handStart + ropeLength
    var afterHandX = blockStartX + 50

    var logPickupX = afterHandX + 50
    var logCarryDist = throwDist*numThrows
    var logFarX = logPickupX + logCarryDist
    var finishX = logFarX + 90

    function px(x,y,w,h,color){ ctx.fillStyle=color; ctx.fillRect(Math.round(x),Math.round(y),w,h) }

    function drawBackground(camX){
      var grad = ctx.createLinearGradient(0,0,0,GROUND)
      grad.addColorStop(0,'#2d1b4e')
      grad.addColorStop(0.45,'#7a3b69')
      grad.addColorStop(0.75,'#e8763c')
      grad.addColorStop(1,'#f4a93c')
      ctx.fillStyle = grad
      ctx.fillRect(0,0,W,GROUND)
      var sunX = 540 - camX*0.15
      ctx.fillStyle = '#ffe89a'
      ctx.beginPath()
      ctx.arc(((sunX%900)+900)%900,60,26,0,Math.PI*2)
      ctx.fill()
      ctx.fillStyle = '#4a2f5e'
      for(var m=0;m<28;m++){
        var mx = (m*220 - camX*0.3)
        mx = ((mx%2900)+2900)%2900 - 100
        ctx.beginPath()
        ctx.moveTo(mx,GROUND)
        ctx.lineTo(mx+60,GROUND-90)
        ctx.lineTo(mx+120,GROUND)
        ctx.fill()
      }
      for(var i=-1;i<W/16+1;i++){
        var wx = i*16 - (camX%16)
        ctx.fillStyle = (Math.floor((i*16+camX)/16))%2===0 ? '#3a6b3a' : '#356235'
        ctx.fillRect(wx,GROUND,16,H-GROUND)
      }
    }

    function drawBeam(l, camX){
      var sx = l.x - camX
      var legSpread = 10
      ctx.strokeStyle = '#4a2c18'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(sx+3, l.y+l.h)
      ctx.lineTo(sx+3-legSpread, GROUND)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(sx+l.w-3, l.y+l.h)
      ctx.lineTo(sx+l.w-3+legSpread, GROUND)
      ctx.stroke()
      px(sx,l.y,l.w,l.h,'#6b4226')
      px(sx,l.y,l.w,3,'#8a5a36')
      px(sx,l.y+l.h-3,l.w,3,'#3a230f')
    }

    function drawLogSegment(seg, camX){
      var x1 = seg.x1-camX, y1 = seg.y1, x2 = seg.x2-camX, y2 = seg.y2
      var dx = x2-x1, dy = y2-y1
      var len = Math.sqrt(dx*dx+dy*dy)
      var angle = Math.atan2(dy,dx)
      var thickness = 7
      ctx.save()
      ctx.translate(x1,y1)
      ctx.rotate(angle)
      ctx.strokeStyle = '#4a2c18'
      ctx.lineWidth = 2
      var legPositions = len > 60 ? [10, len-10, len/2] : [8, len-8]
      legPositions.forEach(function(lp){
        var wx = seg.x1 + Math.cos(angle)*lp
        var wy = seg.y1 + Math.sin(angle)*lp
        ctx.save()
        ctx.rotate(-angle)
        ctx.translate(-x1,-y1)
        ctx.beginPath()
        ctx.moveTo(wx-camX, wy+thickness/2)
        ctx.lineTo(wx-camX, GROUND)
        ctx.stroke()
        ctx.restore()
      })
      ctx.fillStyle = '#6b4226'
      ctx.fillRect(0,-thickness/2,len,thickness)
      ctx.fillStyle = '#8a5a36'
      ctx.fillRect(0,-thickness/2,len,2)
      ctx.fillStyle = '#3a230f'
      ctx.fillRect(0,thickness/2-2,len,2)
      ctx.restore()
    }

    function drawVBeam(b, camX){
      var sx = b.x - camX
      var w = 14
      px(sx-w/2, GROUND-b.h, w, b.h, '#6b4226')
      px(sx-w/2, GROUND-b.h, w, 3, '#8a5a36')
      px(sx-w/2, GROUND-3, w, 3, '#3a230f')
    }

    function drawSandbag(x,y,camX){
      var sx=x-camX
      px(sx,y,14,10,'#c9a36a')
      px(sx+2,y+2,10,6,'#a9824f')
    }

    function drawWeight(x,y,camX){
      var sx=x-camX
      ctx.fillStyle='#444441'
      ctx.beginPath()
      ctx.arc(sx,y+4,9,0,Math.PI*2)
      ctx.fill()
      px(sx-2,y-2,4,12,'#888780')
    }

    function drawBarbell(x, liftP, camX){
      var sx = x - camX
      var lowY = GROUND - 9
      var highY = GROUND - 30
      var barY = lowY + (highY-lowY)*liftP
      ctx.fillStyle = '#555550'
      ctx.beginPath()
      ctx.arc(sx-22, barY, 9, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(sx+22, barY, 9, 0, Math.PI*2)
      ctx.fill()
      px(sx-22,barY-3,44,6,'#888780')
    }

    function roundRectPath(cx,cy,w,h,r){
      r = Math.min(r, w/2, h/2)
      ctx.beginPath()
      ctx.moveTo(cx-w/2+r, cy-h/2)
      ctx.lineTo(cx+w/2-r, cy-h/2)
      ctx.arcTo(cx+w/2, cy-h/2, cx+w/2, cy-h/2+r, r)
      ctx.lineTo(cx+w/2, cy+h/2-r)
      ctx.arcTo(cx+w/2, cy+h/2, cx+w/2-r, cy+h/2, r)
      ctx.lineTo(cx-w/2+r, cy+h/2)
      ctx.arcTo(cx-w/2, cy+h/2, cx-w/2, cy+h/2-r, r)
      ctx.lineTo(cx-w/2, cy-h/2+r)
      ctx.arcTo(cx-w/2, cy-h/2, cx-w/2+r, cy-h/2, r)
      ctx.closePath()
    }

    function drawTireFlat(x, flipP, camX){
      var sx = x - camX
      var s = Math.sin(Math.min(flipP,1)*Math.PI)
      var w = tireDiameter - (tireDiameter-tireThickness)*s
      var h = tireThickness + (tireDiameter-tireThickness)*s
      var cy = GROUND - h/2
      ctx.fillStyle = '#0a0e17'
      roundRectPath(sx, cy+2, w*0.96, h*0.96, Math.min(w,h)/2)
      ctx.fill()
      ctx.fillStyle = '#1f1f1f'
      roundRectPath(sx, cy, w, h, Math.min(w,h)/2)
      ctx.fill()
      ctx.fillStyle = '#0a0e17'
      var innerW = w*0.42, innerH = h*0.42
      roundRectPath(sx, cy, Math.max(innerW,6), Math.max(innerH,6), Math.min(innerW,innerH)/2)
      ctx.fill()
      ctx.strokeStyle = '#3a3a3a'
      ctx.lineWidth = 2
      roundRectPath(sx, cy, w*0.7, h*0.7, Math.min(w,h)*0.35)
      ctx.stroke()
    }

    function drawRock(x, y, camX){
      var sx = x-camX
      ctx.fillStyle = '#6b6b66'
      ctx.beginPath()
      ctx.moveTo(sx-8,y)
      ctx.lineTo(sx-5,y-7)
      ctx.lineTo(sx+3,y-8)
      ctx.lineTo(sx+8,y-2)
      ctx.lineTo(sx+6,y+3)
      ctx.lineTo(sx-4,y+3)
      ctx.closePath()
      ctx.fill()
      ctx.fillStyle = '#8a8a82'
      ctx.beginPath()
      ctx.moveTo(sx-5,y-7)
      ctx.lineTo(sx+3,y-8)
      ctx.lineTo(sx,y-4)
      ctx.closePath()
      ctx.fill()
    }

    function drawStump(x, camX){
      var sx = x - camX
      var w = 26, h = 20
      ctx.fillStyle = '#5a3a22'
      ctx.beginPath()
      ctx.ellipse(sx, GROUND-2, w/2+3, 5, 0, 0, Math.PI*2)
      ctx.fill()
      px(sx-w/2, GROUND-h, w, h-4, '#6b4226')
      ctx.fillStyle = '#8a5a36'
      ctx.beginPath()
      ctx.ellipse(sx, GROUND-h, w/2, 6, 0, 0, Math.PI*2)
      ctx.fill()
      ctx.strokeStyle = '#5a3a22'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(sx, GROUND-h, w/2*0.6, 3.5, 0, 0, Math.PI*2)
      ctx.stroke()
    }

    function drawSack(x,y,camX){
      var sx = x-camX
      ctx.fillStyle = '#8a7048'
      ctx.beginPath()
      ctx.moveTo(sx-9,y)
      ctx.quadraticCurveTo(sx-11,y-12,sx-3,y-15)
      ctx.quadraticCurveTo(sx+10,y-15,sx+9,y-3)
      ctx.quadraticCurveTo(sx+9,y+2,sx-9,y)
      ctx.closePath()
      ctx.fill()
    }

    function drawWheelbarrow(x, sacks, camX){
      var sx = x - camX
      var wheelY = GROUND - 9
      ctx.fillStyle = '#333330'
      ctx.beginPath()
      ctx.arc(sx+16, wheelY, 9, 0, Math.PI*2)
      ctx.fill()
      ctx.fillStyle = '#555550'
      ctx.beginPath()
      ctx.arc(sx+16, wheelY, 3, 0, Math.PI*2)
      ctx.fill()
      ctx.strokeStyle = '#5a4a3a'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(sx+16, wheelY)
      ctx.lineTo(sx-2, GROUND-18)
      ctx.moveTo(sx-22, GROUND)
      ctx.lineTo(sx-2, GROUND-18)
      ctx.stroke()
      ctx.fillStyle = '#7a6a52'
      ctx.beginPath()
      ctx.moveTo(sx-2, GROUND-26)
      ctx.lineTo(sx+14, GROUND-22)
      ctx.lineTo(sx+10, GROUND-10)
      ctx.lineTo(sx-10, GROUND-12)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#5a4a3a'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(sx-22, GROUND-2); ctx.lineTo(sx-32, GROUND-2)
      ctx.moveTo(sx-20, GROUND-8); ctx.lineTo(sx-30, GROUND-8)
      ctx.stroke()
      if(sacks >= 1) drawSackInBin(sx+1, GROUND-22, '#8a7048')
      if(sacks >= 2) drawSackInBin(sx+7, GROUND-20, '#9a8058')
    }

    function drawSackInBin(sx,y,color){
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.ellipse(sx, y, 7, 5, 0, 0, Math.PI*2)
      ctx.fill()
    }

    function drawStake(x, camX){
      var sx = x-camX
      px(sx-2, GROUND-32, 4, 32, '#6b4226')
      px(sx-2, GROUND-32, 4, 3, '#8a5a36')
    }

    function drawSled(x, camX){
      var sx = x - camX
      var boxW = 50, boxH = 26
      var runnerH = 6
      ctx.fillStyle = '#3a2c1f'
      px(sx-boxW/2-3, GROUND-runnerH, boxW+6, runnerH, '#3a2c1f')
      ctx.fillStyle = '#5a4a3a'
      ctx.beginPath()
      ctx.moveTo(sx-boxW/2-4, GROUND-runnerH)
      ctx.lineTo(sx-boxW/2-9, GROUND-runnerH+3)
      ctx.lineTo(sx-boxW/2-4, GROUND)
      ctx.closePath()
      ctx.fill()
      px(sx-boxW/2, GROUND-runnerH-boxH, boxW, boxH, '#6b4226')
      px(sx-boxW/2, GROUND-runnerH-boxH, boxW, 4, '#8a5a36')
      px(sx-boxW/2, GROUND-runnerH-boxH+4, 3, boxH-4, '#3a230f')
      px(sx+boxW/2-3, GROUND-runnerH-boxH+4, 3, boxH-4, '#3a230f')
      px(sx-2, GROUND-runnerH-boxH+4, 3, boxH-4, '#3a230f')
    }

    function drawCementBlock(x, camX){
      var sx = x - camX
      var w = 24, h = 22
      px(sx-w/2, GROUND-h, w, h, '#7a7a74')
      px(sx-w/2, GROUND-h, w, 4, '#9a9a92')
      px(sx-w/2, GROUND-4, w, 4, '#5a5a54')
      ctx.strokeStyle = '#5a5a54'
      ctx.lineWidth = 1
      ctx.strokeRect(sx-w/2+2, GROUND-h+5, w-4, h-9)
    }

    function drawBigLogGround(x, camX){
      var sx = x - camX
      var len = 50, th = 14
      px(sx-len/2, GROUND-th, len, th, '#6b4226')
      ctx.fillStyle = '#8a5a36'
      ctx.beginPath()
      ctx.ellipse(sx-len/2, GROUND-th/2, 5, th/2, 0, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(sx+len/2, GROUND-th/2, 5, th/2, 0, 0, Math.PI*2)
      ctx.fill()
    }

    function drawBigLogHeld(sx, bodyY){
      var len = 56, th = 14
      px(sx-len/2, bodyY-14, len, th, '#6b4226')
      ctx.fillStyle = '#8a5a36'
      ctx.beginPath()
      ctx.ellipse(sx-len/2, bodyY-14+th/2, 5, th/2, 0, 0, Math.PI*2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(sx+len/2, bodyY-14+th/2, 5, th/2, 0, 0, Math.PI*2)
      ctx.fill()
    }

    function drawFinish(x, camX){
      var sx = x - camX
      px(sx-2, GROUND-60, 4, 60, '#5a4a3a')
      px(sx+2, GROUND-60, 4, 60, '#5a4a3a')
      px(sx-2, GROUND-60, 8, 14, '#d8334a')
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'center'
      ctx.lineWidth = 3
      ctx.strokeStyle = '#1a2236'
      ctx.strokeText("FINISH", sx+2, GROUND-50)
      ctx.fillStyle = '#ffe89a'
      ctx.fillText("FINISH", sx+2, GROUND-50)
    }

    function drawRope(fromX, fromY, toX, toY, camX){
      ctx.strokeStyle = '#c9a36a'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(fromX-camX, fromY)
      var midX = (fromX+toX)/2-camX, midY = Math.max(fromY,toY)+6
      ctx.quadraticCurveTo(midX, midY, toX-camX, toY)
      ctx.stroke()
    }

    function drawStraightRope(fromX, fromY, toX, toY, camX){
      ctx.strokeStyle = '#c9a36a'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(fromX-camX, fromY)
      ctx.lineTo(toX-camX, toY)
      ctx.stroke()
    }

    function drawGroundLabel(worldX, text, camX){
      var sx = worldX - camX
      if(sx < -100 || sx > W+100) return
      ctx.font = '12px Arial, sans-serif'
      ctx.textAlign = 'center'
      ctx.lineWidth = 3
      ctx.lineJoin = 'round'
      ctx.strokeStyle = '#1a2236'
      ctx.strokeText(text, sx, GROUND + 22)
      ctx.fillStyle = '#ffe89a'
      ctx.fillText(text, sx, GROUND + 22)
    }

    function drawRunner(sx,y,frame,carrying,crouchAmt,throwAmt,bigCarry,pushing,pulling,handPull,logCarry){
      var legOffset = (frame%2===0)?2:-2
      var crouch = crouchAmt||0
      var lean = (pulling||handPull) ? 8 : 0
      var bodyY = y - 26 + crouch*10
      px(sx-3+lean*0.3,bodyY+9,9,9-crouch*3,'#3050d0')
      px(sx-4+lean*0.3,bodyY,11,10,'#e8b98a')
      px(sx-5+lean*0.3,bodyY-5,13,6,'#d8334a')
      px(sx-6+lean*0.3,bodyY-2,15,3,'#d8334a')
      px(sx-2+lean*0.3,bodyY+4,2,2,'#1a2236')
      px(sx+2+lean*0.3,bodyY+4,2,2,'#1a2236')
      px(sx-3+lean*0.3,bodyY+6,8,2,'#7a4a2a')
      if(crouchAmt===undefined){
        px(sx-3,bodyY+18,3,8+legOffset,'#2a3f6b')
        px(sx+3,bodyY+18,3,8-legOffset,'#2a3f6b')
        px(sx-3,bodyY+25+legOffset,4,3,'#3a2a1a')
        px(sx+3,bodyY+25-legOffset,4,3,'#3a2a1a')
      } else {
        px(sx-5,bodyY+9+crouch*3,4,12-crouch*5,'#2a3f6b')
        px(sx+2,bodyY+9+crouch*3,4,12-crouch*5,'#2a3f6b')
        px(sx-6,bodyY+20,5,3,'#3a2a1a')
        px(sx+2,bodyY+20,5,3,'#3a2a1a')
      }
      if(pulling || handPull){
        var armCycle = (frame%2===0) ? 1 : -1
        px(sx-12,bodyY+2+armCycle,5,3,'#e8b98a')
        px(sx-12,bodyY+8-armCycle,5,3,'#e8b98a')
      } else if(throwAmt !== undefined){
        px(sx-6,bodyY+10,4,3,'#e8b98a')
        var armY = bodyY + 2 - throwAmt*14
        var armX = sx + 8 + throwAmt*6
        px(armX,armY,4,3,'#e8b98a')
      } else if(pushing){
        px(sx-6,bodyY+10,4,3,'#e8b98a')
        px(sx+6,bodyY+4,8,3,'#e8b98a')
      } else if(logCarry){
        px(sx-9,bodyY-8,4,3,'#e8b98a')
        px(sx+5,bodyY-8,4,3,'#e8b98a')
      } else {
        px(sx-6,bodyY+10,4,3,'#e8b98a')
        px(sx+8,bodyY+10,4,3,'#e8b98a')
      }
      if(carrying) px(sx+6,bodyY-4,12,9,'#c9a36a')
      if(bigCarry) drawStumpHeld(sx, bodyY)
      if(logCarry) drawBigLogHeld(sx, bodyY)
    }

    function drawStumpHeld(sx, bodyY){
      var w = 22, h = 16
      px(sx-w/2+10, bodyY-10, w, h, '#6b4226')
      ctx.fillStyle = '#8a5a36'
      ctx.beginPath()
      ctx.ellipse(sx+10, bodyY-10, w/2*0.8, 5, 0, 0, Math.PI*2)
      ctx.fill()
    }

    function buildJumpSegments(beamList, fromX, toX){
      var segs = []
      var cursor = fromX
      beamList.forEach(function(b){
        var takeoff = b.x - APPROACH
        var peak = b.x + b.w/2
        var land = b.x + b.w + CLEAR
        if(Math.abs(takeoff-cursor) > 1) segs.push({type:'run', from:cursor, to:takeoff})
        segs.push({type:'jump', from:takeoff, peakX:peak, to:land, beamY:b.y})
        cursor = land
      })
      if(Math.abs(toX-cursor) > 1) segs.push({type:'run', from:cursor, to:toX})
      return segs
    }

    function buildPeakSegments(beamList, fromX, toX){
      var segs = []
      var firstX = beamList[0].x
      if(Math.abs(firstX-fromX) > 1) segs.push({type:'run', from:fromX, to:firstX-30})
      segs.push({type:'vjump', from:firstX-30, to:firstX, fromY:GROUND, toY:GROUND-beamList[0].h})
      for(var i=0;i<beamList.length-1;i++){
        segs.push({type:'vjump', from:beamList[i].x, to:beamList[i+1].x, fromY:GROUND-beamList[i].h, toY:GROUND-beamList[i+1].h})
      }
      var lastB = beamList[beamList.length-1]
      segs.push({type:'vjump', from:lastB.x, to:lastB.x+30, fromY:GROUND-lastB.h, toY:GROUND})
      if(Math.abs(toX-(lastB.x+30)) > 1) segs.push({type:'run', from:lastB.x+30, to:toX})
      return segs
    }

    function buildHeaveSegments(){
      var segs = []
      var cursor = heaveStart
      for(var i=0;i<numThrows;i++){
        segs.push({type:'throw', x:cursor, rockTo:cursor+throwDist})
        segs.push({type:'run', from:cursor, to:cursor+throwDist})
        cursor += throwDist
      }
      return segs
    }

    function segDuration(seg){
      if(seg.type==='run') return Math.max(0.25, Math.abs(seg.to-seg.from)/140)
      if(seg.type==='jump') return 0.5
      if(seg.type==='vjump') return Math.max(0.35, Math.abs(seg.to-seg.from)/85)
      if(seg.type==='deadlift') return 5 * 1.0
      if(seg.type==='tireflip') return 1.2
      if(seg.type==='throw') return 0.7
      if(seg.type==='wheel') return Math.max(0.5, Math.abs(seg.to-seg.from)/100)
      if(seg.type==='pull') return Math.max(0.6, Math.abs(seg.to-seg.from)/80)
      if(seg.type==='ropepull') return 1.8
      return Math.max(0.25, Math.abs(seg.to-seg.from)/100)
    }

    function buildTimeline(segs){
      var timeline = []
      var tcur = 0
      segs.forEach(function(seg){
        var dur = segDuration(seg)
        timeline.push({seg:seg, start:tcur, dur:dur})
        tcur += dur
      })
      return {timeline:timeline, total:tcur}
    }

    function evalTimeline(tl, localT){
      var list = tl.timeline
      for(var i=0;i<list.length;i++){
        var e = list[i]
        if(localT <= e.start+e.dur || i===list.length-1){
          var seg = e.seg
          var p = e.dur>0 ? Math.min(1,(localT-e.start)/e.dur) : 1
          if(seg.type==='run' || seg.type==='pull'){
            return {x: seg.from + (seg.to-seg.from)*p, y: GROUND}
          } else if(seg.type==='ramp'){
            var rx = seg.from + (seg.to-seg.from)*p
            return {x:rx, y: rampYAt(rx)}
          } else if(seg.type==='vjump'){
            var vx = seg.from + (seg.to-seg.from)*p
            var baseY = seg.fromY + (seg.toY-seg.fromY)*p
            var extraArc = Math.sin(p*Math.PI)*16
            return {x:vx, y: baseY - extraArc}
          } else if(seg.type==='deadlift'){
            var repP = (p*5) % 1
            var liftP = Math.sin(repP*Math.PI)
            return {x:seg.x, y:GROUND, lift:liftP}
          } else if(seg.type==='tireflip'){
            var crouchP = p<0.25 ? p/0.25 : (p<0.75 ? 1 : 1-(p-0.75)/0.25)
            var flipP = p<0.25 ? 0 : (p<0.75 ? (p-0.25)/0.5 : 1)
            var tfx = seg.runnerFrom + (seg.runnerTo-seg.runnerFrom)*flipP
            var tireX2 = seg.tireFrom + (seg.tireTo-seg.tireFrom)*flipP
            return {x:tfx, y:GROUND, crouch:crouchP, tireX:tireX2, flipP:flipP}
          } else if(seg.type==='throw'){
            var windupP = p<0.4 ? p/0.4 : 1
            var throwP = p<0.4 ? 0 : (p-0.4)/0.6
            var rockX = seg.x + (seg.rockTo-seg.x)*throwP
            var rockY = GROUND - Math.sin(throwP*Math.PI)*30
            var armAmt = p<0.4 ? -windupP*0.3 : (1-throwP)*0.9
            return {x:seg.x, y:GROUND, rockX:rockX, rockY:rockY, throwAmt:armAmt, isThrow:true}
          } else if(seg.type==='wheel'){
            var wx = seg.from + (seg.to-seg.from)*p
            return {x:wx, y:GROUND}
          } else if(seg.type==='ropepull'){
            var blockX2 = seg.blockFrom + (seg.blockTo-seg.blockFrom)*p
            return {x:seg.x, y:GROUND, blockX:blockX2}
          } else {
            var jx
            if(p<0.5) jx = seg.from + (seg.peakX-seg.from)*(p/0.5)
            else jx = seg.peakX + (seg.to-seg.peakX)*((p-0.5)/0.5)
            var arcHeight = (GROUND - seg.beamY) + 16
            var jy = GROUND - Math.sin(p*Math.PI)*arcHeight
            return {x:jx, y:jy}
          }
        }
      }
      return {x:60,y:GROUND}
    }

    var jump1TL = buildTimeline(buildJumpSegments(logs, startX, sandbagX))
    var runBackTL = buildTimeline([{type:'run', from:sandbagX, to:runBackX}])
    var jump2TL = buildTimeline(buildJumpSegments(logs, runBackX, sandbagX))
    var toWeight2TL = buildTimeline([{type:'run', from:sandbagX, to:weight2X}])
    var rampTL = buildTimeline([{type:'ramp', from:weight2X, to:dropX}])
    var toPeaksTL = buildTimeline([{type:'run', from:dropX, to:peakStart-30}])
    var peaksTL = buildTimeline(buildPeakSegments(vBeams, peakStart-30, peakEnd))
    var toBarTL = buildTimeline([{type:'run', from:peakEnd, to:barX}])
    var deadliftTL = buildTimeline([{type:'deadlift', x:barX}])
    var toTireTL = buildTimeline([{type:'run', from:barX, to:tireApproachX}])
    var flip1TL = buildTimeline([{type:'tireflip', runnerFrom:tireApproachX, runnerTo:tireStartX+flipDist-tireDiameter/2-15, tireFrom:tireStartX, tireTo:tireStartX+flipDist}])
    var toFarSideTL = buildTimeline([{type:'run', from:tireStartX+flipDist-tireDiameter/2-15, to:tireFarSideX}])
    var flip2TL = buildTimeline([{type:'tireflip', runnerFrom:tireFarSideX, runnerTo:tireStartX-tireDiameter/2-15, tireFrom:tireStartX+flipDist, tireTo:tireStartX}])
    var afterTireTL = buildTimeline([{type:'run', from:tireStartX-tireDiameter/2-15, to:afterTireX}])
    var toHeaveTL = buildTimeline([{type:'run', from:afterTireX, to:heaveStart}])
    var heaveTL = buildTimeline(buildHeaveSegments())
    var afterHeaveTL = buildTimeline([{type:'run', from:heaveEnd, to:stumpStartX}])
    var stumpCarryTL = buildTimeline([{type:'run', from:stumpStartX, to:stumpEndX}])
    var afterStumpTL = buildTimeline([{type:'run', from:stumpEndX, to:haulSackX}])
    var carry1TL = buildTimeline([{type:'run', from:haulSackX, to:wheelbarrowX}])
    var backToSack2TL = buildTimeline([{type:'run', from:wheelbarrowX, to:haulSackX}])
    var carry2TL = buildTimeline([{type:'run', from:haulSackX, to:wheelbarrowX}])
    var wheelTL = buildTimeline([{type:'wheel', from:wheelbarrowX, to:stakesEndX}])
    var afterHaulTL = buildTimeline([{type:'run', from:stakesEndX, to:sledStartX}])
    var pullTL = buildTimeline([{type:'pull', from:sledStartX, to:sledEndX}])
    var afterSledTL = buildTimeline([{type:'run', from:sledEndX, to:handStart}])
    var ropePull1TL = buildTimeline([{type:'ropepull', x:handStart, blockFrom:blockStartX, blockTo:handStart}])
    var runRopeTL = buildTimeline([{type:'run', from:handStart, to:blockStartX}])
    var ropePull2TL = buildTimeline([{type:'ropepull', x:blockStartX, blockFrom:handStart, blockTo:blockStartX}])
    var afterHandTL = buildTimeline([{type:'run', from:blockStartX, to:logPickupX}])
    var logOutTL = buildTimeline([{type:'run', from:logPickupX, to:logFarX}])
    var logBackTL = buildTimeline([{type:'run', from:logFarX, to:logPickupX}])
    var toFinishTL = buildTimeline([{type:'run', from:logPickupX, to:finishX}])

    var T_PICKUP = 0.35
    var T_PUTDOWN = 0.35

    var T1 = jump1TL.total
    var T2 = T1 + T_PICKUP
    var T3 = T2 + runBackTL.total
    var T4 = T3 + jump2TL.total
    var T5 = T4 + T_PUTDOWN
    var T6 = T5 + toWeight2TL.total
    var T7 = T6 + T_PICKUP
    var T8 = T7 + rampTL.total
    var T9 = T8 + T_PUTDOWN
    var T10 = T9 + toPeaksTL.total
    var T11 = T10 + peaksTL.total
    var T12 = T11 + toBarTL.total
    var T13 = T12 + deadliftTL.total
    var T14 = T13 + toTireTL.total
    var T15 = T14 + flip1TL.total
    var T16 = T15 + toFarSideTL.total
    var T17 = T16 + flip2TL.total
    var T18 = T17 + afterTireTL.total
    var T18b = T18 + toHeaveTL.total
    var T19 = T18b + heaveTL.total
    var T20 = T19 + afterHeaveTL.total
    var T21 = T20 + T_PICKUP
    var T22 = T21 + stumpCarryTL.total
    var T23 = T22 + T_PUTDOWN
    var T24 = T23 + afterStumpTL.total
    var T25 = T24 + T_PICKUP
    var T26 = T25 + carry1TL.total
    var T27 = T26 + T_PUTDOWN
    var T28 = T27 + backToSack2TL.total
    var T29 = T28 + T_PICKUP
    var T30 = T29 + carry2TL.total
    var T31 = T30 + T_PUTDOWN
    var T32 = T31 + wheelTL.total
    var T33 = T32 + afterHaulTL.total
    var T34 = T33 + pullTL.total
    var T35 = T34 + afterSledTL.total
    var T36 = T35 + ropePull1TL.total
    var T37 = T36 + runRopeTL.total
    var T38 = T37 + ropePull2TL.total
    var T39 = T38 + afterHandTL.total
    var T40 = T39 + T_PICKUP
    var T41 = T40 + logOutTL.total
    var T42 = T41 + logBackTL.total
    var T43 = T42 + T_PUTDOWN
    var T44 = T43 + toFinishTL.total
    var totalDuration = T44 + 0.5

    var tireX = tireStartX, tireFlipP = 0
    var rockWorldX = heaveStart, rockWorldY = GROUND
    var stumpWorldX = stumpStartX
    var sacksInBarrow = 0
    var wheelbarrowWorldX = wheelbarrowX
    var sledWorldX = sledStartX
    var blockWorldX = blockStartX
    var bigLogVisible = false, bigLogX = logPickupX

    var playing = false, t = 0, lastTime = null
    var rafId = null

    function getState(t){
      var frame = Math.floor(t*8)
      tireX = tireStartX; tireFlipP = 0
      rockWorldX = heaveStart; rockWorldY = GROUND
      stumpWorldX = stumpStartX
      sacksInBarrow = 0
      wheelbarrowWorldX = wheelbarrowX
      sledWorldX = sledStartX
      blockWorldX = blockStartX
      bigLogVisible = false; bigLogX = logPickupX
      if(t < T1){ var p=evalTimeline(jump1TL,t); return {x:p.x,y:p.y,frame:frame,c1:false,c2:false} }
      if(t < T2) return {x:sandbagX,y:GROUND,frame:frame,c1:false,c2:false}
      if(t < T3){ var p2=evalTimeline(runBackTL,t-T2); return {x:p2.x,y:p2.y,frame:frame,c1:true,c2:false} }
      if(t < T4){ var p3=evalTimeline(jump2TL,t-T3); return {x:p3.x,y:p3.y,frame:frame,c1:true,c2:false} }
      if(t < T5) return {x:sandbagX,y:GROUND,frame:frame,c1: t<T4+T_PUTDOWN*0.6,c2:false}
      if(t < T6){ var p4=evalTimeline(toWeight2TL,t-T5); return {x:p4.x,y:p4.y,frame:frame,c1:false,c2:false} }
      if(t < T7) return {x:weight2X,y:GROUND,frame:frame,c1:false,c2:false}
      if(t < T8){ var p5=evalTimeline(rampTL,t-T7); return {x:p5.x,y:p5.y,frame:frame,c1:false,c2:true} }
      if(t < T9) return {x:dropX,y:GROUND,frame:frame,c1:false,c2: t<T8+T_PUTDOWN*0.6}
      if(t < T10){ var p6=evalTimeline(toPeaksTL,t-T9); return {x:p6.x,y:p6.y,frame:frame,c1:false,c2:false} }
      if(t < T11){ var p7=evalTimeline(peaksTL,t-T10); return {x:p7.x,y:p7.y,frame:frame,c1:false,c2:false} }
      if(t < T12){ var p8=evalTimeline(toBarTL,t-T11); return {x:p8.x,y:p8.y,frame:frame,c1:false,c2:false} }
      if(t < T13){ var p9=evalTimeline(deadliftTL,t-T12); return {x:p9.x,y:p9.y,frame:frame,c1:false,c2:false,lift:p9.lift} }
      if(t < T14){ var p10=evalTimeline(toTireTL,t-T13); return {x:p10.x,y:p10.y,frame:frame,c1:false,c2:false} }
      if(t < T15){
        var p11=evalTimeline(flip1TL,t-T14)
        tireX = p11.tireX; tireFlipP = p11.flipP
        return {x:p11.x,y:GROUND,frame:frame,c1:false,c2:false,crouch:p11.crouch}
      }
      if(t < T16){
        tireX = tireStartX+flipDist; tireFlipP=0
        var p12=evalTimeline(toFarSideTL,t-T15); return {x:p12.x,y:p12.y,frame:frame,c1:false,c2:false}
      }
      if(t < T17){
        var p13=evalTimeline(flip2TL,t-T16)
        tireX = p13.tireX; tireFlipP = p13.flipP
        return {x:p13.x,y:GROUND,frame:frame,c1:false,c2:false,crouch:p13.crouch}
      }
      if(t < T18){
        tireX = tireStartX; tireFlipP=0
        var p14=evalTimeline(afterTireTL,t-T17); return {x:p14.x,y:p14.y,frame:frame,c1:false,c2:false}
      }
      if(t < T18b){
        var p14b=evalTimeline(toHeaveTL,t-T18); return {x:p14b.x,y:p14b.y,frame:frame,c1:false,c2:false}
      }
      if(t < T19){
        var p15 = evalTimeline(heaveTL, t-T18b)
        if(p15.isThrow){
          rockWorldX = p15.rockX; rockWorldY = p15.rockY
          return {x:p15.x,y:GROUND,frame:frame,c1:false,c2:false,throwAmt:p15.throwAmt}
        } else {
          rockWorldX = p15.x; rockWorldY = GROUND
          return {x:p15.x,y:p15.y,frame:frame,c1:false,c2:false}
        }
      }
      if(t < T20){
        rockWorldX = heaveEnd; rockWorldY = GROUND
        stumpWorldX = stumpStartX
        var p16=evalTimeline(afterHeaveTL,t-T19); return {x:p16.x,y:p16.y,frame:frame,c1:false,c2:false}
      }
      rockWorldX = heaveEnd; rockWorldY = GROUND
      if(t < T21){ stumpWorldX = stumpStartX; return {x:stumpStartX,y:GROUND,frame:frame,c1:false,c2:false} }
      if(t < T22){
        var p17=evalTimeline(stumpCarryTL,t-T21)
        stumpWorldX = p17.x
        return {x:p17.x,y:GROUND,frame:frame,c1:false,c2:false,bigCarry:true}
      }
      if(t < T23){
        stumpWorldX = stumpEndX
        return {x:stumpEndX,y:GROUND,frame:frame,c1:false,c2:false,bigCarry: t<T22+T_PUTDOWN*0.6}
      }
      stumpWorldX = stumpEndX
      if(t < T24){ var p18=evalTimeline(afterStumpTL,t-T23); return {x:p18.x,y:p18.y,frame:frame,c1:false,c2:false} }
      if(t < T25){ return {x:haulSackX,y:GROUND,frame:frame,c1:false,c2:false} }
      if(t < T26){
        var p19=evalTimeline(carry1TL,t-T25)
        return {x:p19.x,y:GROUND,frame:frame,c1:false,c2:false,carryingSack:true}
      }
      if(t < T27){ sacksInBarrow=1; return {x:wheelbarrowX,y:GROUND,frame:frame,c1:false,c2:false} }
      sacksInBarrow=1
      if(t < T28){ var p20=evalTimeline(backToSack2TL,t-T27); return {x:p20.x,y:p20.y,frame:frame,c1:false,c2:false} }
      if(t < T29){ return {x:haulSackX,y:GROUND,frame:frame,c1:false,c2:false} }
      if(t < T30){
        var p21=evalTimeline(carry2TL,t-T29)
        return {x:p21.x,y:GROUND,frame:frame,c1:false,c2:false,carryingSack:true}
      }
      if(t < T31){ sacksInBarrow=2; return {x:wheelbarrowX,y:GROUND,frame:frame,c1:false,c2:false} }
      sacksInBarrow=2
      if(t < T32){
        var p22=evalTimeline(wheelTL,t-T31)
        wheelbarrowWorldX = p22.x
        return {x:p22.x-14,y:GROUND,frame:frame,c1:false,c2:false,pushing:true}
      }
      wheelbarrowWorldX = stakesEndX
      if(t < T33){ var p23=evalTimeline(afterHaulTL,t-T32); return {x:p23.x,y:p23.y,frame:frame,c1:false,c2:false} }
      if(t < T34){
        var p24 = evalTimeline(pullTL, t-T33)
        sledWorldX = p24.x - 50
        return {x:p24.x,y:GROUND,frame:frame,c1:false,c2:false,pulling:true}
      }
      sledWorldX = sledEndX-50
      if(t < T35){ var p25=evalTimeline(afterSledTL,t-T34); return {x:p25.x,y:p25.y,frame:frame,c1:false,c2:false} }
      if(t < T36){
        var p26 = evalTimeline(ropePull1TL, t-T35)
        blockWorldX = p26.blockX
        return {x:p26.x,y:GROUND,frame:frame,c1:false,c2:false,handPull:true}
      }
      blockWorldX = handStart
      if(t < T37){ var p27=evalTimeline(runRopeTL,t-T36); return {x:p27.x,y:p27.y,frame:frame,c1:false,c2:false} }
      if(t < T38){
        var p28 = evalTimeline(ropePull2TL, t-T37)
        blockWorldX = p28.blockX
        return {x:p28.x,y:GROUND,frame:frame,c1:false,c2:false,handPull:true}
      }
      blockWorldX = blockStartX
      if(t < T39){ var p29=evalTimeline(afterHandTL,t-T38); return {x:p29.x,y:p29.y,frame:frame,c1:false,c2:false} }
      if(t < T40){ bigLogVisible=true; bigLogX=logPickupX; return {x:logPickupX,y:GROUND,frame:frame,c1:false,c2:false} }
      if(t < T41){
        var p30=evalTimeline(logOutTL,t-T40)
        bigLogVisible=false
        return {x:p30.x,y:GROUND,frame:frame,c1:false,c2:false,logCarry:true}
      }
      if(t < T42){
        var p31=evalTimeline(logBackTL,t-T41)
        bigLogVisible=false
        return {x:p31.x,y:GROUND,frame:frame,c1:false,c2:false,logCarry:true}
      }
      if(t < T43){
        bigLogVisible = t > T42+T_PUTDOWN*0.4; bigLogX=logPickupX
        return {x:logPickupX,y:GROUND,frame:frame,c1:false,c2:false,logCarry: t<T42+T_PUTDOWN*0.6}
      }
      bigLogVisible=true; bigLogX=logPickupX
      if(t < T44){ var p32=evalTimeline(toFinishTL,t-T43); return {x:p32.x,y:p32.y,frame:frame,c1:false,c2:false} }
      return {x:finishX,y:GROUND,frame:frame,c1:false,c2:false,finished:true}
    }

    function render(t){
      var s = getState(t)
      var camX = Math.max(0, s.x - 160)
      drawBackground(camX)
      logs.forEach(function(l){ drawBeam(l,camX) })
      drawGroundLabel((startX+sandbagX)/2-30, "OVER & OUT", camX)
      var bagAtStart = t < T2 - 0.05
      var bagAtEnd = t > T4 + T_PUTDOWN*0.55 && t < T6
      if(bagAtStart || bagAtEnd) drawSandbag(sandbagX-7, GROUND-12, camX)

      rampLogs.forEach(function(seg){ drawLogSegment(seg, camX) })
      drawGroundLabel((rampStart+rampEnd)/2, "THE WOBBLER", camX)
      var weightAtStart = t < T7 - 0.05
      var weightAtEnd = t > T8 + T_PUTDOWN*0.55 && t < T10
      if(weightAtStart) drawWeight(weight2X, GROUND-10, camX)
      if(weightAtEnd) drawWeight(dropX, GROUND-10, camX)

      vBeams.forEach(function(b){ drawVBeam(b, camX) })
      drawGroundLabel((peakStart+peakEnd)/2, "THE PEAKS", camX)

      var liftP = (t>=T12 && t<T13) ? s.lift : 0
      drawBarbell(barX, liftP, camX)
      drawGroundLabel(barX, "THE RANCH BAR", camX)

      drawTireFlat(tireX, tireFlipP, camX)
      drawGroundLabel(tireStartX+flipDist/2, "GROUND & POUND", camX)

      if(t>=T18b-0.1 && t<T20+0.1){
        drawRock(rockWorldX, rockWorldY-6, camX)
      }
      drawGroundLabel((heaveStart+heaveEnd)/2, "THE HEAVE", camX)

      var stumpVisible = t < T21+0.05 || t >= T22+T_PUTDOWN*0.5
      if(stumpVisible && !(t>=T21 && t<T22)) drawStump(stumpWorldX, camX)
      drawGroundLabel((stumpStartX+stumpEndX)/2, "DEAD WEIGHT", camX)

      var sackVisibleAtStart = t < T25 - 0.05 || (t>=T27 && t<T29-0.05)
      if(sackVisibleAtStart) drawSack(haulSackX, GROUND-2, camX)
      stakeXs.forEach(function(sxp){ drawStake(sxp, camX) })
      drawWheelbarrow(wheelbarrowWorldX, sacksInBarrow, camX)
      drawGroundLabel((haulSackX+stakesEndX)/2, "THE HAUL", camX)

      if(t >= T33-0.1 && t < T35+0.1){
        drawSled(sledWorldX, camX)
        if(t>=T33 && t<T34){
          drawRope(s.x-10, GROUND-22, sledWorldX+24, GROUND-30, camX)
          drawRope(s.x-6, GROUND-16, sledWorldX+22, GROUND-22, camX)
        }
      }
      drawGroundLabel((sledStartX+sledEndX)/2, "THE DRAG", camX)

      if(t >= T35-0.1 && t < T39+0.1){
        drawCementBlock(blockWorldX, camX)
        if((t>=T35 && t<T36) || (t>=T37 && t<T38)){
          drawStraightRope(s.x-10, GROUND-16, blockWorldX, GROUND-12, camX)
        }
      }
      drawGroundLabel((handStart+blockStartX)/2, "HAND OVER FIST", camX)

      if(bigLogVisible) drawBigLogGround(bigLogX, camX)
      drawFinish(finishX, camX)
      drawGroundLabel((logPickupX+logFarX)/2, "THE LUMBERJACK", camX)

      var crouchVal, throwVal, bigCarryVal, carryingSackVal, pushingVal, pullingVal, handPullVal, logCarryVal
      if(t>=T11 && t<T13) crouchVal = (1-liftP)
      else if((t>=T14 && t<T15) || (t>=T16 && t<T17)) crouchVal = s.crouch
      if(t>=T18b && t<T19 && s.throwAmt !== undefined) throwVal = s.throwAmt
      if(t>=T21 && t<T23) bigCarryVal = s.bigCarry
      if((t>=T25 && t<T27) || (t>=T29 && t<T31)) carryingSackVal = true
      if(t>=T31 && t<T32) pushingVal = true
      if(t>=T33 && t<T34) pullingVal = true
      if((t>=T35 && t<T36) || (t>=T37 && t<T38)) handPullVal = true
      if(t>=T40 && t<T43) logCarryVal = s.logCarry

      if(crouchVal !== undefined){
        drawRunner(s.x-camX, s.y, s.frame, false, crouchVal)
      } else if(throwVal !== undefined){
        drawRunner(s.x-camX, s.y, s.frame, false, undefined, throwVal)
      } else if(bigCarryVal){
        drawRunner(s.x-camX, s.y, s.frame, false, undefined, undefined, true)
      } else if(carryingSackVal){
        drawRunner(s.x-camX, s.y, s.frame, true)
      } else if(pushingVal){
        drawRunner(s.x-camX, s.y, s.frame, false, undefined, undefined, false, true)
      } else if(pullingVal){
        drawRunner(s.x-camX, s.y, s.frame, false, undefined, undefined, false, false, true)
      } else if(handPullVal){
        drawRunner(s.x-camX, s.y, s.frame, false, undefined, undefined, false, false, false, true)
      } else if(logCarryVal){
        drawRunner(s.x-camX, s.y, s.frame, false, undefined, undefined, false, false, false, false, true)
      } else {
        drawRunner(s.x-camX, s.y, s.frame, s.c1 || s.c2 ? true : false)
      }
    }

    var captionMap = [
      {until:T2, text:'Jump all 4 beams, grab the bag'},
      {until:T4, text:'Run back, jump all 4 again with the bag'},
      {until:T5, text:'Set the bag down where it started'},
      {until:T7, text:'Run to the ramp and grab the weight'},
      {until:T9, text:"Up and across the beam with the weight. Don't fall"},
      {until:T10, text:'Run to The Peaks'},
      {until:T11, text:'Run up and then down the beams'},
      {until:T12, text:'Run to The Ranch Bar'},
      {until:T13, text:'5 deadlifts on the cement-weighted bar'},
      {until:T14, text:'Run to the tire'},
      {until:T15, text:'Flip the tire over to its other side'},
      {until:T16, text:'Run around to the other side'},
      {until:T17, text:'Flip it back over the other way'},
      {until:T18b, text:'Run to The Heave'},
      {until:T19, text:'Throw the rock, chase it down, throw again'},
      {until:T21, text:'Grab the stump'},
      {until:T22, text:'Carry it across — Dead Weight'},
      {until:T23, text:'Drop the stump on the other side'},
      {until:T25, text:'Grab the first sack'},
      {until:T27, text:'Load it into the wheelbarrow'},
      {until:T29, text:'Go back for the second sack'},
      {until:T31, text:'Load the second sack in'},
      {until:T32, text:'Push the wheelbarrow through the stakes'},
      {until:T33, text:'Run to the sled'},
      {until:T35, text:'Grab both ropes and drag the sled across'},
      {until:T36, text:'Pull the cement block in to your feet'},
      {until:T37, text:'Run the length of the rope'},
      {until:T38, text:'Pull it back to where it started'},
      {until:T40, text:'Grab the big log'},
      {until:T41, text:'Carry it out'},
      {until:T42, text:'Carry it back'},
      {until:T43, text:'Set it down'},
      {until:Infinity, text:'Run to the finish — course complete!'}
    ]

    function updateCaption(t){
      for(var i=0;i<captionMap.length;i++){
        if(t <= captionMap[i].until){
          setCaption(captionMap[i].text)
          return
        }
      }
    }

    function loop(ts){
      if(!playing) return
      if(lastTime===null) lastTime = ts
      var dt = (ts-lastTime)/1000
      lastTime = ts
      t += dt
      if(t >= totalDuration){
        t = totalDuration
        render(t)
        playing = false
        setIsPlaying(false)
        setCaption('COURSE COMPLETE!')
        return
      }
      render(t)
      updateCaption(t)
      rafId = requestAnimationFrame(loop)
    }

    handlePlayRef.current = function(){
      if(playing) return
      playing = true; t = 0; lastTime = null
      setIsPlaying(true)
      rafId = requestAnimationFrame(loop)
    }

    handleResetRef.current = function(){
      playing = false
      if(rafId) cancelAnimationFrame(rafId)
      t = 0; lastTime = null
      setIsPlaying(false)
      setCaption('THE DIRT')
      render(0)
    }

    render(0)

    return () => {
      playing = false
      if(rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div style={{ width: '100%', maxWidth: '520px', marginTop: '32px', textAlign: 'center' }}>
      <style>{`
        .walkthrough-panel:fullscreen,
        .walkthrough-panel:-webkit-full-screen {
          background: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          box-sizing: border-box;
        }
        .walkthrough-panel:fullscreen canvas,
        .walkthrough-panel:-webkit-full-screen canvas {
          width: 100% !important;
          height: auto !important;
          max-height: 80vh;
        }
      `}</style>
      <h2 style={{
        fontFamily: 'var(--font-arcade)',
        fontSize: 'clamp(0.65rem, 3vw, 0.9rem)',
        color: 'var(--cyan)',
        letterSpacing: '3px',
        marginBottom: '12px',
      }}>
        PREVIEW THE COURSE
      </h2>
      <div
        ref={containerRef}
        className="walkthrough-panel"
        style={{
          border: '2px solid var(--cyan)',
          background: 'rgba(0,0,20,0.85)',
          padding: '8px',
        }}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={220}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
        <p style={{
          fontFamily: 'var(--font-arcade)',
          fontSize: '0.45rem',
          color: 'var(--yellow)',
          letterSpacing: '1px',
          margin: '8px 4px 4px',
          minHeight: '1.6em',
          lineHeight: '1.6',
        }}>
          {caption}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px', marginBottom: '4px' }}>
          <button
            className="btn btn-cyan btn-small"
            onClick={() => handlePlayRef.current?.()}
            disabled={isPlaying}
            style={{ opacity: isPlaying ? 0.5 : 1 }}
          >
            {isPlaying ? '⏸ PLAYING' : '▶ PLAY'}
          </button>
          <button
            className="btn btn-purple btn-small"
            onClick={() => handleResetRef.current?.()}
          >
            ↺ RESET
          </button>
          <button
            className="btn btn-orange btn-small"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? '✕ EXIT' : '⛶ FULLSCREEN'}
          </button>
        </div>
      </div>
    </div>
  )
}
