import axios from 'axios';
import { useQuery } from 'react-query';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function SellPage({ response }) {
  const { data, isLoading, error } = useQuery('sells', getPosts, {
    initialData: response,
  });

  console.log('data useQuery: ', data);

  if (isLoading) return 'Loading...';
  if (error) return error.message;
  return (
    <div>
      <p>Hello SellPage!!{data.message}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const response = await getPosts();
  console.log('response', response);
  if (!response) {
    return {
      notFound: true,
    };
  }

  return {
    props: { response }, // will be passed to the page component as props. always return an object with the props key
  };
}

async function getPosts() {
  // console.log('HOST: ', process.env.HOST);
  console.log(publicRuntimeConfig.host);
  // console.log(process.env.HOST);
  const { data } = await axios.request({
    baseURL: publicRuntimeConfig.host,
    // baseURL: process.env.HOST,
    url: '/api/v1/list',
    method: 'get',
  });
  return data;
}
