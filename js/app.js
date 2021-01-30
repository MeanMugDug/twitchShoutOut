var access_token
var broadcast_id
var shoutout_id


var app = new Vue({
    el: '#app',
    data: {
      clipSource: "",
      shoutout_id: ""
    },
    mounted() {
      //https://id.twitch.tv/oauth2/token?client_id=uo6dggojyb8d6soh92zknwmi5ej1q2&client_secret=nyo51xcdrerl8z9m56w9w6wg&grant_type=client_credentials
      var XML = new XMLHttpRequest();
            
      XML.open("POST", "https://id.twitch.tv/oauth2/token?client_id=cjw2ewijhdkcfvm194n67pvlqvo4rr&client_secret=eprn4zv0kj7dgxnooy18zsh38vx0r6&grant_type=client_credentials");
      XML.send();
      XML.onload = function () {
        var obj = JSON.parse(XML.response);
        access_token = obj["access_token"]

        if(window.location.hash) {
          var username = window.location.hash
          username = username.replace("#", "")
          ComfyJS.Init( username );

          var userSearch = new XMLHttpRequest();
          var b_id
          var channels
          
          userSearch.open("GET", "https://api.twitch.tv/helix/search/channels?query=" + username);
          userSearch.setRequestHeader('Client-ID', 'cjw2ewijhdkcfvm194n67pvlqvo4rr');
          userSearch.setRequestHeader('Authorization', 'Bearer ' + access_token);
          userSearch.send();
    
          userSearch.onload = function () {
            channels = JSON.parse(userSearch.response).data
    
            for (x in channels) {
              if(channels[x].display_name == username){
                broadcast_id = channels[x].id
              }
            }
            
          }
        }

      }



      

    }
  })


  ComfyJS.onCommand = ( userId, command, message, flags, extra ) => {

    if( flags.broadcaster && command === "so" ) {
      console.log("Shouting out " + message)

      var userSearch = new XMLHttpRequest();

      userSearch.open("GET", "https://api.twitch.tv/helix/search/channels?query=" + message);
      userSearch.setRequestHeader('Client-ID', 'cjw2ewijhdkcfvm194n67pvlqvo4rr');
      userSearch.setRequestHeader('Authorization', 'Bearer ' + access_token);
      userSearch.send();

      userSearch.onload = function () {
        channels = JSON.parse(userSearch.response).data

        for (x in channels) {
          if(channels[x].display_name == message){
            shoutout_id = channels[x].id
            getClips()
          }
        }
        
      }

      //https://api.twitch.tv/helix/clips?broadcaster_id=

      //app.message = ("<iframe src=\"https://clips.twitch.tv/embed?clip=PoliteFinePlumAllenHuhu&parent=www.example.com\" frameborder=\"0\" allowfullscreen=\"true\" scrolling=\"no\" height=\"378\" width=\"620\"></iframe>")
    }
    
  }

  function getClips(){
    var getClips = new XMLHttpRequest();

    getClips.open("GET", "https://api.twitch.tv/helix/clips?broadcaster_id=" + shoutout_id);
    getClips.setRequestHeader('Client-ID', 'cjw2ewijhdkcfvm194n67pvlqvo4rr');
    getClips.setRequestHeader('Authorization', 'Bearer ' + access_token);
    getClips.send();

    getClips.onload = function () {

      var clips = JSON.parse(getClips.response).data
      console.log(clips)
      chooseClips(clips)


    }
  }

  function chooseClips(clips){
    var broadcasterClips = []

    for (x in clips){
      if(clips[x].creator_id == broadcast_id){
        broadcasterClips.push(clips[x].embed_url)
      }
      broadcasterClips.push(clips[x].embed_url)
    }

    app.clipSource = broadcasterClips[0]

  }


  

  function getTwitchClips() {
    var XML = new XMLHttpRequest();
            
    XML.open("GET", "https://api.twitch.tv/helix/clips?broadcaster_id=" + broadcast_id);
    XML.setRequestHeader('Client-ID', 'cjw2ewijhdkcfvm194n67pvlqvo4rr');
    XML.send();
    XML.onload = function () {
      console.log(XML.response);
    }
  }

 