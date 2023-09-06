// import React, { useState, useEffect } from 'react';
// import { Polyline } from '@react-google-maps/api';

// const Route = ({ id }) => {
//   const [polylineString, setPolylineString] = useState(null);

//   useEffect(() => {
//     const fetchPolyline = async () => {
//       const response = await fetch(`/api/routes/${id}`);
//       const data = await response.json();
//       setPolylineString(data.polyline);
//     };

//     fetchPolyline();
//   }, [id]);

//   if (!polylineString) {
//     return null;
//   }

//   const polylineArray = polyline.decode(polylineString);
//   const path = polylineArray.map(([lat, lng]) => ({ lat, lng }));

//   return (
//     <Polyline
//       path={path}
//       geodesic={true}
//       options={{
//         strokeColor: '#FF0000',
//         strokeOpacity: 1.0,
//         strokeWeight: 2,
//       }}
//     />
//   );
// };

// export default Route;
