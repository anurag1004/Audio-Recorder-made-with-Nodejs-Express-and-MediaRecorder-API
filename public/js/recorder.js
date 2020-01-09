$(document).ready(()=>{
    const record =$('#record'),
    stop = $('#stop'),
    recorded=$('#recorded'),
    send=$('#send');
    var chunks = [];
    var blob=null;


    async function getMedia(content){
        let stream=null;
        let options={
            audioBitsPerSecond : 128000,
            mimeType:'audio/webm'
        };
        try{
            stream = await navigator.mediaDevices.getUserMedia(content);
            console.log('got the stream!');
            console.log(stream);
            let mediaRecorder = new MediaRecorder(stream,options);
            $(record).on('click',(event)=>{
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                }
            })

            $(stop).on('click',(event)=>{
                mediaRecorder.stop();
                console.log(mediaRecorder.state);
                console.log("recorder stopped");
            })
            mediaRecorder.onstop=(e)=>{

                console.log(chunks);
                blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                console.log(blob);
                chunks = [];
                var audioURL = window.URL.createObjectURL(blob);
                console.log(audioURL);
                $(recorded).attr('src',audioURL);
             
            }
            $(send).on('click',(event)=>{
            
                var xhr=new XMLHttpRequest();
                xhr.onload=function(e) {
                    if(this.readyState === 4) {
                        console.log("Server returned: ",e.target.responseText);
                    }
                };
                var fd=new FormData();
                fd.append("audio_data",blob, "filename.wav");
                xhr.open("POST","/save-audio",true);
                xhr.send(fd);
            })

        }catch(err){
            console.log(err);
        }
    }
    const content ={ audio : true, sampleRate: 48000, sampleSize: 32, channelCount: {ideal:2,min:1}};
    getMedia(content);
})