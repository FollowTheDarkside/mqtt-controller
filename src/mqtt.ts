// @ts-ignore
type MqttClient = mqtt.MqttClient;
// type MessageHandler = (message: string) => void;

export class MqttManager {
    client: MqttClient;
    url: string;
    topic: string;
    // messageHandlers: MessageHandler[];

    constructor(protocol: string, host: string, port: number, topic: string) {
        console.log("const...");
        this.url = protocol + "://" + host + ":" + String(port)
        this.topic = topic
        // this.messageHandlers = [];
    }

    connect(){
        // @ts-ignore
        this.client = mqtt.connect(this.url);
        this.client.on('connect', () => {
            console.log('Connected!')
            this.client.subscribe(this.topic, (err: Error | null) => {
                if(err){
                    console.log("sub error:", err)
                }
            })
        });

        // this.client.on('message', (topic: string, message: Buffer) => {
        //     // console.log("Received:", message.toString());
        //     this.messageHandlers.forEach(handler => {
        //         handler(message.toString());
        //     });
        // });
    }

    disconnect(){
        this.client.end();
    }

    sendMessage(message: string){
        this.client.publish(this.topic, message);
    }

    // addMessageHandler(handler: MessageHandler) {
    //     this.messageHandlers.push(handler);
    // }
}