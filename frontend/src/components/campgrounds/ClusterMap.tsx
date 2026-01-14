import Map, { Marker, Popup, NavigationControl } from "react-map-gl/mapbox";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";
import type { Campground } from "../../store/campgroundStore";
import { Link } from "react-router-dom";

const MAPTILER_KEY = import.meta.env.VITE_MAPTILER_KEY;

interface MapProps {
  campgrounds: Campground[];
}

export default function ClusterMap({ campgrounds }: MapProps) {
  const [selectedCamp, setSelectedCamp] = useState<Campground | null>(null);
  const initialView =
    campgrounds.length > 0 && campgrounds[0].geometry
      ? {
          longitude: campgrounds[0].geometry.coordinates[0],
          latitude: campgrounds[0].geometry.coordinates[1],
          zoom: campgrounds.length === 1 ? 10 : 3, // Zoom in if it's a single map
        }
      : { longitude: -103.59, latitude: 40.66, zoom: 3 };
  return (
    <div
      className="mb-4"
      style={{
        height: "400px",
        width: "100%",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Map
        mapLib={maplibregl}
        initialViewState={initialView}
        style={{ width: "100%", height: "100%" }}
        mapStyle={`https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`}
      >
        <NavigationControl position="top-right" />
        {campgrounds.map((camp) => {
          // Safety check for legacy data without geometry
          const [lng, lat] = camp.geometry?.coordinates || [];

          if (
            !camp.geometry ||
            !camp.geometry.coordinates ||
            camp.geometry.coordinates.length < 2 ||
            isNaN(lng) ||
            isNaN(lat)
          ) {
            return null; // Don't render a marker for this broken campground
          }

          return (
            <Marker
              key={camp._id}
              longitude={camp.geometry.coordinates[0]}
              latitude={camp.geometry.coordinates[1]}
              anchor="bottom"
              onClick={(e: any) => {
                e.originalEvent.stopPropagation();
                setSelectedCamp(camp);
              }}
            >
              <div style={{ cursor: "pointer", fontSize: "24px" }}>⛺</div>
            </Marker>
          );
        })}
        {selectedCamp && (
          <Popup
            longitude={selectedCamp.geometry.coordinates[0]}
            latitude={selectedCamp.geometry.coordinates[1]}
            onClose={() => setSelectedCamp(null)}
            closeOnClick={false}
            offset={25}
          >
            <div className="text-center fw-bold">
              <h6>{selectedCamp.title}</h6>
              <p className="m-0" style={{ fontSize: "0.8rem" }}>
                {selectedCamp.location}
              </p>
              <Link to={`/campgrounds/${selectedCamp._id}`}>View Details</Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
