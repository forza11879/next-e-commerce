import dynamic from 'next/dynamic';
const StarRating = dynamic(() => import('react-star-ratings'), {
  ssr: false,
});
// import StarRating from 'react-star-ratings';

const Star = ({ starClick, numberOfStars }) => (
  <>
    <StarRating
      changeRating={() => starClick(numberOfStars)}
      numberOfStars={numberOfStars}
      starDimension="20px"
      starSpacing="2px"
      starHoverColor="red"
      starEmptyColor="red"
    />
    <br />
  </>
);

export default Star;
