import apis from 'configs/apis';
export const getlistMessage = (reciver_id, page) => {
  return apis.fetch(apis.PATH.CHATS, {
    reciver_id,
    page,
  });
};
