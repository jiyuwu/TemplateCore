using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;

namespace TemplateCore.Middleware
{
    /// <summary>
    /// websocket中间件，客户端发送的信息显示在控件台上，客户端会定时收到服务端推送的时间
    /// </summary>
    public class WebSocketNotify
    {
        /// <summary>
        /// 管道代理对象
        /// </summary>
        private readonly RequestDelegate _next;
        /// <summary>
        /// 构造函数传入下一个中间件
        /// </summary>
        /// <param name="next"></param>
        public WebSocketNotify(RequestDelegate next)
        {
            _next = next;
        }
        /// <summary>
        /// 中间件调用
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        public Task Invoke(HttpContext context)
        {
            //判断是否为websocket请求
            if (context.WebSockets.IsWebSocketRequest)
            {
                //接收客户端
                var webSocket = context.WebSockets.AcceptWebSocketAsync().Result;
                //启用一个线程处理接收客户端数据
                new Thread(Accept).Start(webSocket);
                while (webSocket.State == WebSocketState.Open)
                {
                    webSocket.SendAsync(new ArraySegment<byte>(System.Text.Encoding.UTF8.GetBytes($"{DateTime.Now}")), System.Net.WebSockets.WebSocketMessageType.Text, true, CancellationToken.None);
                    Thread.Sleep(1000);
                }
            }
            return this._next(context);//调用下一个中间件

        }
        /// <summary>
        /// 接收客户端数据方法，这里可以根据自己的需求切换功能代码
        /// </summary>
        /// <param name="obj"></param>
        void Accept(object obj)
        {
            var webSocket = obj as WebSocket;
            while (true)
            {
                var acceptArr = new byte[1024];

                var result = webSocket.ReceiveAsync(new ArraySegment<byte>(acceptArr), CancellationToken.None).Result;

                var acceptStr = System.Text.Encoding.UTF8.GetString(acceptArr).Trim(char.MinValue);
                Console.WriteLine("收到信息：" + acceptStr);
            }

        }
    }
}
