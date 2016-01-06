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
<p>sed -i 's/geteuid/getppid/' /usr/bin/vlc</p>

<h2>How to do it.</h2>

<h4>If you want to use radio controlled stuff you need <a href="http://www.github.com/mingram8/Radio">Radio</a> and <a href="http://www.github.com/timleland/rfoutlet">rfoutlet</a> installed</h4>
<p><b>You have to use Linux on the server it runs on</b>. I really don't like Windows, especially as a server, and don't feel like dealing with it. You could probably get it running on OSX with some tuning. You have to have MongoDB installed and running. Let it sit on the default port. If you want to lock it down (which you should) then add credentials to config/express.js. I don't have any in the default app. This is how all of the clients are aware of the current state of the house. After that, just do a NPM install from the Node-House directory.</p>
 <p>VLC is what plays the music. So, you need that downloaded. You could use something like omxplayer, but you lose
 http server support, so pause/play will not work. If that isn't a big deal then go ahead and find+replace cvlc in src/node/controllers/playMusic.controller with player of your choice. Also, change spawn.spawn('cvlc', ['-I', 'http', req.url, 'localhost:8080']); to spawn.spawn('omxplayer', [req.url]); [or player of your choice instead of omxplayer] and it should work.
 </p>
 <p>On first boot, an admin user is loaded. To set up your House, login as username: admin, password:admin and navigate to /admin. From there there are tabs to set everything up. All they actually do is modify the config files under config/custom_configs if you would like to do it manually. But for on the fly modifications use the admin page. <b>Except for House, that requires a restart</b>. I haven't figured out a way around that yet. Mongoose really throws a fit.</p>
 
 <p>House structure can only be 3 deep. So, Bedroom.lamp.on or bedroom.hall.color.</p>
 
 <p>Only users with the admin (all lowercase) role can modify the admin page. If you accidentally delete your admin, a new admin admin user is created. Only admin can add new users.</p>
 
  <h2>Raspberry Pi use</h2>
 <p>It was a bit of a pain but I have it working on my Raspberry Pi 2 running Jessie.</p>
 
 <p>You need to make sure your Nodejs is at least version 4 or it won't work. I installed directly from nodejs.org because the one in the raspbian repository is 0.10.29 and pcap just doesn't work with it.</p>
 <p>After that run sudo apt-get install libpcap-dev and then npm install . Then run it with sudo node server.js and it should be up and running. Buttons won't appear at first because it will ping the server for a house, none will be found, then a new one will be saved and on the next ping buttons will load. So, don't panic.</p>
 <p>Modify /etc/asound.conf with </br>
 pcm.mmap0 {
    type mmap_emul;
    slave {
      pcm "hw:0,0";
    }
}

pcm.!default {
  type plug;
  slave {
    pcm mmap0;
  }
}</p>
 <p>Make sure you have amixer volume set and the right output or vlc will sound like it doesn't work. If you are using an aux port with the analog output I would type sudo amixer cset numid=3 1 then amixer sset 'Master' 50%   just to make sure. It stumped me for a bit since I had it on auto and the HDMI plugged in. I think it was sending sound to my monitor with no output.</p>
 
 <p> I honestly stopped using the pi and use an old laptop as the server with the pis as relays (for radio controls and the like). The sliders just don't work well enough on the pi. If you don't want to adjust volume and are ok with sliders being jittery, then the pi works great. I am sure if I had a faster sd card, it would work great. The issue, I believe, is rapidly storing the slider states in mongodb, since controlling volume and brightness by exact values works fine.</p>
 
 
 <h3>To fullscreen the application, click on the clock.</h3>
 
 <h2>Microphone use</h2>
 <p>I added a HTML5 mic that sends words to a server. It is for voice control and the intercom. My tablets microphones aren't actually good enough to use it so it isn't that important. I added a https port so that you don't get pinged every 5 seconds for access to the microphone. If you don't use it, deny it access and it will shutup.</p>
 
 <h2>Users.</h2>
 
 <p>It uses users to determine who gets buttons and to somewhat add protection. Use Postman (search in chrome store, it is free) and do a post to /users. with the form body username: <username>, password:<password>, role:<role>. Role should be 'admin' to have total control over all the buttons. I have different logins for foyer/livingroom/kitchen and my bedroom so people can't toggle my bedroom lights.
 

 <h2>Work in progress.</h2>
 
 <p>I never really intended to 1) publish this or 2) for it to get as large as it did. So, there will be hiccups
 along the way. If you find them, feel free to fix them and do a pull request.</p>
