# Problem 2: Fancy Form

## Demo Video
https://drive.google.com/file/d/1e-jvZ7FXPtY04ocG_kjNf5d5WhM2EDoI/view?usp=sharing

## How to run
+ Run `npm install` to install all necessary node modules.
+ Run `npm run dev` to start the development server.
+ Browse the demo at `localhost:5173` on a browser.
+ Select from and to token to swap.
+ Enter an amount at either from or to.
+ Wait for a quote. This is real quote from PancakeSwap.
+ Click swap button and see success/error popup. Please note that the process is faked.
+ Every 2nd swap is a failured, the next will be a success.

## Tech stacks

### Vite + ReactJS Typescript
Not because of the bonus points but I usually used Vite + ReactJS for projects that are not SEO-critical, ie. an Admin Dashboard, a Facial-Recognition attendancy app for meeting. I am also used to working with Typescript because it is very hard to trace typos and type errors using purely JS. This will require less testing needed to be done and is critical for financial related apps. Vite React Typescript also compiles typescript pretty fast and well integrated with TailwindCSS.

For more SEO-critical project I actually prefer NextJS.

### TailwindCSS + DaisyUI
For quick prototyping, DaisyUI is my choice. It is purely built over TailwindCSS without extra footprints and pretty eye-candied.

The design I am referencing is the Swap dialog from PancakeSwap. I found `cupcake` theme of DaisyUI fits the design quite well.

### Ethers.js v6
In this demo, I used Binance Chain to demonstrate the swap tokens app and I wanted to make it as realistic as possible, not just using fake data.

### DotLottie React
It is very hard to demonstrate fancy animations using CSS alone. I added 2 lottie animations for the success and failure dialogs.

## Solved problems

### Shared Form data across components
The form is a little complicated and it would be messy to lift-up props across components. I decided to make the form context in the file `TokenSwapFormProvider.tsx` that is shared with all the related components. The approach requires the components to depend on the context but it looks cleaner. I also tried to make the components as independent as possible.

I managed the data flow using purely React Context. For more larger scale projects, a central data store is necessary where `redux` or `zustand` is more suitable.

### Fetch blockchain data
The `TokenListProvider` fetches data from a JSON file endpoint to provide the list of tokens and their metadata. The `TokenSwapProvider` provides the function to call PancakeSwap smartcontract methods to get the swap quotes. The swap function is fake.

At first, I wanted to use QuoterV2 to get more precise quotation but I could not make it after a while so I decided to fall back to the `quoteAmountIn/Out` combos. Based on these outputs, I could calculate the necessary data like swap fee, price impact, etc.

### Debounced
When user inputs amount, it triggers the quote debounced function that throttles the function calls from too fast inputs. I also added `callId` to the fetch coroutine to only accept the latest fetch call because `clearTimeout` does not stop the old fetches.

If it was the regular `fetch` calls, I could have used `AbortController` to abandon the old process. It was smartcontract RPC call but I think by creating a custom RPC provider, I can abort a smartcontract call in the middle but it will take some time to improve it.
