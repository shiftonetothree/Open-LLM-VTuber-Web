// 创建 WebSocket 连接
const socket = new WebSocket('ws://127.0.0.1:8888');

// 连接成功时触发
socket.addEventListener('open', (event) => {
  console.log('已连接到服务器');
  socket.send('你好，服务器！');
});

// 连接关闭时触发
socket.addEventListener('close', (event) => {
  console.log('连接已关闭');
});

// 错误处理
socket.addEventListener('error', (event) => {
  console.error('连接错误:', event);
});

const reciverList: Function[] = [];


export const registerDanmuEvent = (callback)=>{
    reciverList.push(callback)
}

export const removeDanmuEvent = (callback)=>{
    if(reciverList.indexOf(callback)>=0){
        reciverList.splice(reciverList.indexOf(callback),1)
    }
}

let lastTime = new Date();

// 接收服务器消息
socket.addEventListener('message', (event) => {
    const content: string = JSON.parse(JSON.parse(event.data).Data).Content;
    if(content.indexOf("直播间人数")<0 
        && content.indexOf("总点赞")<0 
        && content.indexOf("关注了主播")<0
        && content.indexOf("送出")<0
    ){
        const now = new Date();
        if(now.getTime() - lastTime.getTime()>5000){
            lastTime = now;
            console.log(content)
            for(const reciver of reciverList){
                reciver(content)
            }
        }
        
    }
    
});