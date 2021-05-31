import StarRating from 'react-star-ratings';

const RatingStar = ({ product }) => {
  const { avgRating, nRatings } = product;
  return (
    <div className="text-center pt-1 pb-3">
      <span>
        <StarRating
          starDimension="20px"
          starSpacing="2px"
          starRatedColor="red"
          rating={avgRating}
          editing={false}
        />{' '}
        ({nRatings})
      </span>
    </div>
  );
};

export default RatingStar;
