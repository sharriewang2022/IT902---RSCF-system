import { message } from 'antd';

const request = (option: { url: RequestInfo | URL; method: any; data: any; }) => fetch(option.url, {
  method: option.method || 'POST',
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(option.data),
})
        .then(response => response.json())
        .then((res) => {
          if (res.code === 200 && res.success) {
            return res.data || res;
          }
          message.error(res.message, 2);
          return null;
        })
        .catch((err) => {
          console.warn('fetch error =====>', err);
          message.error('fail', 2);
          return null;
        });

export default request;
