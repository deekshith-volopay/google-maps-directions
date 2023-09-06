import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Autocomplete,
  DirectionsRenderer,
  Polyline,
} from '@react-google-maps/api'
import { useRef, useState } from 'react'

const center = { lat: 12.7409, lng: 77.8253 }

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  })

  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [selectedPolyline, setSelectedPolyline] = useState(null)



  const originRef = useRef()
  const destiantionRef = useRef()

  if (!isLoaded) {
    return <SkeletonText />
  }

  async function calculateRoute() {
    if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    })
    setSelectedPolyline(results.routes[0].overview_polyline)
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    console.log(results)
    // eslint-disable-next-line no-undef
    const decoded = new google.maps.geometry.encoding.decodePath(results.routes[0].overview_polyline);
    setSelectedPolyline(decoded)
    // eslint-disable-next-line no-undef
    var polyline = new google.maps.Polyline({
      path: [],
      strokeColor: '#FF0000',
      strokeWeight: 3
    });
    // eslint-disable-next-line no-undef
    var bounds = new google.maps.LatLngBounds();
    
    
    var legs = results.routes[0].legs;
    for (let i=0;i<legs.length;i++) {
      var steps = legs[i].steps;
      for (let j=0;j<steps.length;j++) {
        var nextSegment = steps[j].path;
        for (let k=0;k<nextSegment.length;k++) {
          polyline.getPath().push(nextSegment[k]);
          bounds.extend(nextSegment[k]);
        }
      }
    }

    console.log(polyline.getPath())
    polyline.setMap(map);
    // eslint-disable-next-line no-undef
    const encodePath = new google.maps.geometry.encoding.encodePath(polyline.getPath().g);

  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }


  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {/* {directionsResponse && (
            directionsResponse.routes.map((route, index) => (
              <DirectionsRenderer
                key={index}
                directions={directionsResponse}
                routeIndex={index}
                options={{ suppressMarkers: true }}
                onDirectionsChanged={() => {console.log()}}
              />
            ))
          )} */}

          <Polyline
            path={selectedPolyline}
            options={{
              strokeColor: 'blue',
              geodesic: true,
              strokeWeight: 4
            }}
          />
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box>

          <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
