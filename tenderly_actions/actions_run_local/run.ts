import { TestTransactionEvent ,TestRuntime} from "@tenderly/actions-test";
import { callBackendApi } from "../actions/api_call";

// run actions locally with TestRuntime
const main = async () => {
    const testRuntime = new TestRuntime();

    await testRuntime.execute(callBackendApi, new TestTransactionEvent());

}

(async () => main())();