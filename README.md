Node House is a NodeJs smart house application. It creates a server with user auth that Tablets, and web pages can hit to control your smart home. 

<p>This was built almost entirely because I wanted to be able to use my Google music account
on my speaker system without paying for a chromecast. It evolved into a pretty massive
project. I attempted to break as much as possible out into config files and will try to explain
it the best I can.</p>

<h2>What does it do?</h2>
<ul>
<li>Plays Google music over your speakers</li>
<li>Adds control to pause, stop, forward, back.</li>
<li>Pretty much complete Play music support, can search, play records, radio stations, read artist bios and etc...</li>
<li>Controls radio controlled smart applications (like power sockets)</li>
<li>Controls Mi Light light bulbs</li>
<li>Sets up an Amazon Dash button network so you can use Dash buttons to control your smart home</li>
<li>Displays time and date</li>
<li>Displays weather data and changes backgrounds for different weather.</li>
<li>Displays a 5 day forecast</li>
<li>Will play white noise if you add the file to src/node/Data</li>
<li>Displays Stock data</li>
</ul>

<h3>Runs in root.</h3>

<p>Cannot stress this enough. It uses node-dash-button to create a network of dash buttons. To do this 
it sniffs the network for mac addresses. If you don't feel comfortable running in root (which makes sense) just remove 
references to node-dash-button and don't use Amazon Dash buttons.</p>

<p>If you feel fine running in root, then you have to modify your VLC so that it will run in root. This command worked
for me: </p>
<p>cp /usr/bin/vlc /usr/bin/vlc-backup
needle=$(objdump -d /usr/bin/vlc | grep euid | tail -1 | awk '{print "\\x"$2"\\x"$3"\\x"$4"\\x"$5"\\x"$6;}')
sed -ir "s/$needle/\xb8\x01\x00\x00\x00/" /usr/bin/vlc</p>

<h2>How to do it</h2>
<p><b>You have to use Linux on the server it runs on</b>. I really don't like Windows, especially as a server, and don't feel like dealing with it. You could probably get it running on OSX with some tuning. You have to have MongoDB installed and running. Let it sit on the default port. If you want to lock it down (which you should) then add credentials to config/express.js. I don't have any in the default app. This is how all of the clients are aware of the current state of the house.</p>
 <p>VLC is what plays the music. So, you need that downloaded. You could use something like omxplayer, but you lose
 http server support, so pause/play will not work. If that isn't a big deal then go ahead and find+replace cvlc in /src/node/controllers/playMusic.controller.js with a player of your choice. Also, change spawn.spawn('cvlc', ['-I', 'http', req.url, 'localhost:8080']); to spawn.spawn('omxplayer', [req.url]); and it should work. [omxplayer can be another player]</p>
 
 <h4>Big BIG thing</h4>
 <p>The house Schema isn't loaded from the config file, SO you will have to modify src/node/models/house.model.js to reflect
 your house.config file. I will hopefully figure this out down the line</p>
 
 <p>If you are running Ubuntu/(other Linux Distro), have MongoDB running, and tell VLC to run in root, now you have to do the configuration setup. All of the files in config/custom_configs/ are what you need to change. Most of them are very easy and take very little to no time. I tried to make it very clear in the comments on those files. The only big one is house.config. It is also <b>Extremely</b> important. The one that is in there, is just an example house. Use lower case letters, it is just easier. You can't use spaces, You can use underscores and add something to regex them out when the buttons are sent, since I capitalize the first letter when the buttons are sent. It is a basic JSON structure. </p>
 <p>The structure has to be identical if you don't want to change any other files. So, objects cant be more than 2 deep. Lights require exactly what they are set up as. You can add as many extra rooms, lights, buttons, etc.. as you want as long as it is setup the same way. I tried to comment each line to help clarity.</p>
 
 <h2>Users</h2>
 <p>It uses users to determine who gets buttons and to somewhat add protection. Use Postman (search in chrome store, it is free) and do a post to /postUsers. with the form body username: <username>, password:<password>, role:<role>. Role should be 'admin' to have total control over all the buttons. I have different logins for foyer/livingroom/kitchen and my bedroom so people can't toggle my bedroom lights.
 
 <h2>Work in progress</h2>
 <p>I never really intended to 1) publish this or 2) for it to get as large as it did. So, there will be hiccups
 along the way. If you find them, feel free to fix them and do a pull request.</p>
