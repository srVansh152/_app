// const retryRequest = async (chatId, retries = 3, delay = 1000) => {
//     try {
//       return await getChatMessages(chatId);
//     } catch (error) {
//       if (retries > 0) {
//         console.log(`Retrying... (${retries} retries left)`);
//         await new Promise(resolve => setTimeout(resolve, delay));
//         return retryRequest(chatId, retries - 1, delay);
//       }
//       throw error;  // If all retries fail, throw the error
//     }
//   };