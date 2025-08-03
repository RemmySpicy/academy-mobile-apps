
import { StyleSheet } from "react-native";
import { colors } from "./helpers";

export const styles = StyleSheet.create({
  input: {
    borderColor: 'gray', // Border color gray-300
    // paddingHorizontal: 16,    // Padding left and right px-4
    borderRadius: 8,         // Rounded corners rounded-lg
    // width: '100%',          // Full width w-full
    // height: 48,             // Height of 12 multiplied by 4 (px-4)
    // fontFamily: 'regular_400',       // Font family font-sr
    // borderWidth:1
  },

  inputFocused: {
    borderColor: 'gray',   // Border color when focused border-theme
  },

  dashedBorder: {
    backgroundColor: 'transparent',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderRadius: 10, 
    borderColor:colors.label
  },
});


export const mapStyle = [
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#d6e2e6"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#cfd4d5"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#7492a8"
          }
      ]
  },
  {
      "featureType": "administrative.neighborhood",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "lightness": 25
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#dde2e3"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#cfd4d5"
          }
      ]
  },
  {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#dde2e3"
          }
      ]
  },
  {
      "featureType": "landscape.natural",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#7492a8"
          }
      ]
  },
  {
      "featureType": "landscape.natural.terrain",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#dde2e3"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#588ca4"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [
          {
              "saturation": -100
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#a9de83"
          }
      ]
  },
  {
      "featureType": "poi.park",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#bae6a1"
          }
      ]
  },
  {
      "featureType": "poi.sports_complex",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#c6e8b3"
          }
      ]
  },
  {
      "featureType": "poi.sports_complex",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#bae6a1"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#41626b"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
          {
              "saturation": -45
          },
          {
              "lightness": 10
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#c1d1d6"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#a6b5bb"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "road.highway.controlled_access",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#9fb6bd"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "labels.icon",
      "stylers": [
          {
              "saturation": -70
          }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#b4cbd4"
          }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#588ca4"
          }
      ]
  },
  {
      "featureType": "transit.station",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#008cb5"
          },
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "transit.station.airport",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "saturation": -100
          },
          {
              "lightness": -5
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#a6cbe3"
          }
      ]
  }
]