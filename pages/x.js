const HomePage = ({ newArrivals }) => {
  const [page, setPage] = useState(1);
  const [arrivals, setArrivals] = useState({ ...newArrivals, page: 1 });

  useEffect(() => {
    setArrivals((values) => {
      console.log({ page });
      return { ...values, page: page };
    });
    setTimeout(function () {
      newArrivalsQuery.refetch();
    }, 0);
  }, [page]);

  const newArrivalsQuery = useQuery(
    ['productListByNewArrivals'],
    () => getProductList(arrivals),
    {
      select: useCallback((data) => {
        return JSON.parse(data);
      }, []),
    }
  );

  return (
    <>
      <NewArrivals
        newArrivalsQuery={newArrivalsQuery}
        page={page}
        setPage={setPage}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  const newArrivals = {
    sort: 'createdAt',
    order: 'desc',
  };

  try {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery('productListByNewArrivals', async () => {
      const newArrivalsResult = await listProduct(newArrivals);
      return JSON.stringify(newArrivalsResult);
    });

    return {
      props: {
        newArrivals: newArrivals,
        dehydratedState: dehydrate(queryClient),
      },
    };
  } catch (error) {
    console.log('error: ', error);
    if (error) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
  }
}
