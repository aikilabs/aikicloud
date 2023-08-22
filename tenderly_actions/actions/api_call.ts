import {
	ActionFn,
	Context,
	Event,
	TransactionEvent
} from '@tenderly/actions';

// import axios from 'axios';


export const callBackendApi: ActionFn = async (context: Context, event: Event) => {
	let transactionEvent = event as TransactionEvent;

	// axios.get('/', {proxy: {host: "127.0.0.1", port: 3001}})
	// .then(response => {
	// 	console.log(response.data);
	// })
	// .catch(error => {
	// 	if(error.response) {
	// 		console.log("response error")
	// 		console.log(error.response.data);
	// 	}else if(error.request) {
	// 		console.log("request error")
	// 		console.log(error.request);
	// 	}else {
	// 		console.log("something else")
	// 		console.log(error.message);
	// 	}
	// })
	console.log(transactionEvent);


	// TODO: call backend api based on events log topics

	// 0xdc39e1687a25985cbc0c627c5b94c2f37b7d7b2a3697237b18202259c267afb8 -> startService
	// startService(id, account, lifetime)

	// 0x212dd7fa4d9bd5706dcf4975eb05bd4cb9d5e3b58d80ae091b620c4fd9de7152 -> extendService
	// extendService(id, account, extensionTime)

	// 0x34b5c9f1c18f9a2fb16b18979fd017991f22dcb8582b323ce4d180047d99c771 -> stopService
	// stopService(id, account)
}


// const startService = async (id: string, account: string, lifetime: number) => {}

// const extendService = async (id: string, account: string, extensionTime: number) => {}

// const stopService = async (id: string, account: string) => {}
