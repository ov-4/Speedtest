const html = `<!DOCTYPE html>
<html>
<head>
<link rel="shortcut icon" href="favicon.ico">
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no" />
<title>speed.ov4.one Speedtest</title>
<script type="text/javascript" src="speedtest.js"></script>
<script type="text/javascript">

//LIST OF TEST SERVERS. See documentation for details if needed
var SPEEDTEST_SERVERS=[
    {
        name:" ",
        server: "//" + window.location.host + "/",
        dlURL:"down?bytes=10000000",
        ulURL:"up",
        pingURL:"ping",
        getIpURL:"ip"
    }
    //add other servers here, comma separated
];


//INITIALIZE SPEEDTEST
var s=new Speedtest(); //create speedtest object

s.onupdate=function(data){ //callback to update data in UI
    I("ip").textContent=data.clientIp;
    I("dlText").textContent=(data.testState==1&&data.dlStatus==0)?"...":data.dlStatus;
    I("ulText").textContent=(data.testState==3&&data.ulStatus==0)?"...":data.ulStatus;
    I("pingText").textContent=data.pingStatus;
    I("jitText").textContent=data.jitterStatus;
    if(data.visitorInfo) {
        updateVisitorInfo(data.visitorInfo);
    }
    if(data.cfInfo) {
        updateCfInfo(data.cfInfo);
    }
}
s.onend=function(aborted){ //callback for test ended/aborted
    I("startStopBtn").className=""; //show start button again
    if(aborted){ //if the test was aborted, clear the UI and prepare for new test
        initUI();
    }
}
function selectServer(){ //called after loading server list
    s.selectServer(function(server){ //run server selection. When the server has been selected, display it in the UI
        I("startStopBtn").style.display=""; //show start/stop button again
        I("serverId").textContent=server.name; //show name of test server
    });
}
function loadServers(){ //called when the page is fully loaded
    I("startStopBtn").style.display="none"; //hide start/stop button during server selection
    if(typeof SPEEDTEST_SERVERS === "string"){
        //load servers from url
        s.loadServerList(SPEEDTEST_SERVERS,function(servers){
            //list loaded
            SPEEDTEST_SERVERS=servers;
            selectServer();
        });
    }else{
        //hardcoded list of servers, already loaded
        s.addTestPoints(SPEEDTEST_SERVERS);
        selectServer();
    }

}



function startStop(){ //start/stop button pressed
    if(s.getState()==3){
        //speedtest is running, abort
        s.abort();
    }else{
        //test is not running, begin
        s.start();
        I("startStopBtn").className="running";
    }
}

function updateVisitorInfo(info) {
    if(!info) return;
    I("visitorIp").textContent = info.ip || 'N/A';
    I("visitorAsn").textContent = info.asn ? 'AS' + info.asn : 'N/A';
    I("visitorIsp").textContent = info.isp || 'N/A';
    I("visitorCountry").textContent = info.country || 'N/A';
    I("visitorRegion").textContent = [info.city, info.region].filter(Boolean).join(', ') || 'N/A';
}

function updateCfInfo(info) {
    if(!info) return;
    I("cfColo").textContent = info.colo || 'N/A';
    I("cfLocation").textContent = [info.city, info.country].filter(Boolean).join(', ') || 'N/A';
}

//function to (re)initialize UI
function initUI(){
    I("dlText").textContent="";
    I("ulText").textContent="";
    I("pingText").textContent="";
    I("jitText").textContent="";
    I("ip").textContent="";
    I("visitorIp").textContent="";
    I("visitorAsn").textContent="";
    I("visitorIsp").textContent="";
    I("visitorCountry").textContent="";
    I("visitorRegion").textContent="";
    I("cfColo").textContent="";
    I("cfLocation").textContent="";
}

function I(id){return document.getElementById(id);}
</script>

<style type="text/css">
    :root { /* light ☀️ */
        color-scheme: light dark;
        --font-color: #000;
        --bg-color: #f1f1f1;
    }
    /* https://caniuse.com/#feat=prefers-color-scheme */
    @media (prefers-color-scheme: dark) {
        :root { /* dark 🌘 */
            --font-color: #e6eaea;
            --bg-color: #222326;
        }
    }

    html,body{
        border:none; padding:0; margin:0;
    }
    body{
        text-align:center;
        font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif;
        background: var(--bg-color);
        color: var(--font-color);
        transition: color ease 0.5s, background ease 0.5s;
    }
    h1{
        color: var(--font-color);
    }
    #startStopBtn{
        display:inline-block;
        margin:0 auto;
        color: var(--font-color);
        background-color:rgba(0,0,0,0);
        border:0.15em solid #6060FF;
        border-radius:0.3em;
        transition:all 0.3s;
        box-sizing:border-box;
        width:8em; height:3em;
        line-height:2.7em;
        cursor:pointer;
        box-shadow: 0 0 0 rgba(0,0,0,0.1), inset 0 0 0 rgba(0,0,0,0.1);
    }
    #startStopBtn:hover{
        box-shadow: 0 0 2em rgba(0,0,0,0.1), inset 0 0 1em rgba(0,0,0,0.1);
    }
    #startStopBtn.running{
        background-color:#FF3030;
        border-color:#FF6060;
        color:#FFFFFF;
    }
    #startStopBtn:before{
        content:"Start";
    }
    #startStopBtn.running:before{
        content:"Abort";
    }
    #test{
        margin-top:2em;
        margin-bottom:12em;
    }
    div.testArea{
        display:inline-block;
        width:14em;
        height:9em;
        position:relative;
        box-sizing:border-box;
    }
    div.testName{
        position:absolute;
        top:0.1em; left:0;
        width:100%;
        font-size:1.4em;
        z-index:9;
    }
    div.meterText{
        position:absolute;
        bottom:1.5em; left:0;
        width:100%;
        font-size:2.5em;
        z-index:9;
    }
    #dlText{
        color:#6060AA;
    }
    #ulText{
        color:#309030;
    }
    #pingText,#jitText{
        color:#AA6060;
    }
    div.meterText:empty:before{
        color:#505050 !important;
        content:"0.00";
    }
    div.unit{
        position:absolute;
        bottom:2em; left:0;
        width:100%;
        z-index:9;
    }
    div.testGroup{
        display:inline-block;
    }
    @media all and (max-width:65em){
        body{
            font-size:1.5vw;
        }
    }
    @media all and (max-width:40em){
        body{
            font-size:0.8em;
        }
        div.testGroup{
            display:block;
            margin: 0 auto;
        }
    }

    /* 新增访客信息和 CF 节点信息样式 */
    #infoArea {
        margin-top: 3em;
        padding: 1em;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 2em;
    }
    .infoCard {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(96, 96, 255, 0.3);
        border-radius: 8px;
        padding: 1.2em;
        min-width: 280px;
        max-width: 400px;
    }
    .infoCard h3 {
        margin: 0 0 0.8em 0;
        font-size: 1.1em;
        color: #6060FF;
        border-bottom: 1px solid rgba(96, 96, 255, 0.3);
        padding-bottom: 0.5em;
    }
    .infoRow {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5em;
        font-size: 0.9em;
    }
    .infoLabel {
        color: #888;
        font-weight: 500;
    }
    .infoValue {
        color: #fff;
        font-weight: 600;
        text-align: right;
    }

</style>
</head>
<body>
<h1>speed.ov4.one Speedtest</h1>
<div id="startStopBtn" onclick="startStop()"></div>
<div id="serverId">Selecting server...</div>
<div id="test">
    <div class="testGroup">
        <div class="testArea">
            <div class="testName">Download</div>
            <div id="dlText" class="meterText"></div>
            <div class="unit">Mbps</div>
        </div>
        <div class="testArea">
            <div class="testName">Upload</div>
            <div id="ulText" class="meterText"></div>
            <div class="unit">Mbps</div>
        </div>
    </div>
    <div class="testGroup">
        <div class="testArea">
            <div class="testName">Ping</div>
            <div id="pingText" class="meterText"></div>
            <div class="unit">ms</div>
        </div>
        <div class="testArea">
            <div class="testName">Jitter</div>
            <div id="jitText" class="meterText"></div>
            <div class="unit">ms</div>
        </div>
    </div>
    <div id="ipArea">
        IP Address: <span id="ip"></span>
    </div>
    <div id="infoArea">
        <div class="infoCard">
            <h3>Client</h3>
            <div class="infoRow">
                <span class="infoLabel">IP Address:</span>
                <span class="infoValue" id="visitorIp"></span>
            </div>
            <div class="infoRow">
                <span class="infoLabel">ISP:</span>
                <span class="infoValue" id="visitorIsp"></span>
            </div>
            <div class="infoRow">
                <span class="infoLabel">ASN:</span>
                <span class="infoValue" id="visitorAsn"></span>
            </div>
            <div class="infoRow">
                <span class="infoLabel">Region:</span>
                <span class="infoValue" id="visitorRegion"></span>
            </div>
            <div class="infoRow">
                <span class="infoLabel">Country:</span>
                <span class="infoValue" id="visitorCountry"></span>
            </div>
        </div>
        <div class="infoCard">
            <h3>Server</h3>
            <div class="infoRow">
                <span class="infoLabel">Connected to:</span>
                <span class="infoValue" id="cfColo"></span>
            </div>
            <div class="infoRow">
                <span class="infoLabel">Location:</span>
                <span class="infoValue" id="cfLocation"></span>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript">
    initUI();
    loadServers();
</script>
</body>
</html>`;
module.exports = html;
