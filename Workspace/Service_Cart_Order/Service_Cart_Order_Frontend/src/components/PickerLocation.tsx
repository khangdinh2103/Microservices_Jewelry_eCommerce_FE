// components/LocationPicker.tsx
import { useMapEvents } from "react-leaflet";
import L from "leaflet";

interface Props {
  onLocationSelect: (lat: number, lng: number) => void;
  setUserInfo: React.Dispatch<React.SetStateAction<any>>;
  setRoute: React.Dispatch<React.SetStateAction<L.LatLng[]>>;
  setRouteInfo: React.Dispatch<React.SetStateAction<any>>;
}

const LocationPicker = ({ onLocationSelect, setUserInfo, setRoute, setRouteInfo }: Props) => {
  useMapEvents({
    click: async (e) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      onLocationSelect(lat, lng);

      try {
        const response = await fetch(`http://localhost:3000/api/location?lat=${lat}&lng=${lng}`);
        const data = await response.json();
        if (data.address) {
          setUserInfo((prev: any) => ({ ...prev, address: data.address }));
        }

        const startLat = 10.808131355448648;
        const startLng = 106.70645211764977;

        const responseRoute = await fetch(
          `http://localhost:3000/api/location/distance?startLat=${startLat}&startLng=${startLng}&endLat=${lat}&endLng=${lng}`
        );
        const routeData = await responseRoute.json();

        if (routeData.message === "Tính khoảng cách thành công!") {
          setRoute([
            new L.LatLng(parseFloat(routeData.from.lat), parseFloat(routeData.from.lng)),
            new L.LatLng(lat, lng),
          ]);
          setRouteInfo({
            distance: parseFloat(routeData.distance_km),
            duration: parseFloat(routeData.duration_minutes),
          });
        }
      } catch (error) {
        console.error("Lỗi khi chọn vị trí:", error);
      }
    },
  });

  return null;
};
interface GetCurrentLocationParams {
  setMapLocation: (location: { lat: number; lng: number }) => void;
  setUserInfo: (cb: (prev: any) => any) => void;
  setRoute: (route: L.LatLng[]) => void;
  setRouteInfo: (info: { distance: number; duration: number }) => void;
}

export const getCurrentLocation = ({
  setMapLocation,
  setUserInfo,
  setRoute,
  setRouteInfo,
}: GetCurrentLocationParams) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapLocation({ lat, lng });

        try {
          // Lấy địa chỉ từ API
          const response = await fetch(`http://localhost:3000/api/location?lat=${lat}&lng=${lng}`);
          const data = await response.json();
          if (data.address) {
            setUserInfo((prev) => ({ ...prev, address: data.address }));
          } else {
            alert("Không thể lấy địa chỉ!");
            return;
          }

          // Tính khoảng cách và thời gian
          const startLat = 10.808131355448648;
          const startLng = 106.70645211764977;

          const responseRoute = await fetch(
            `http://localhost:3000/api/location/distance?startLat=${startLat}&startLng=${startLng}&endLat=${lat}&endLng=${lng}`
          );
          const routeData = await responseRoute.json();

          if (routeData.message === "Tính khoảng cách thành công!") {
            setRoute([
              new L.LatLng(parseFloat(routeData.from.lat), parseFloat(routeData.from.lng)),
              new L.LatLng(lat, lng),
            ]);
            setRouteInfo({
              distance: parseFloat(routeData.distance_km),
              duration: parseFloat(routeData.duration_minutes),
            });
          } else {
            alert("Không thể tính khoảng cách!");
          }
        } catch (error) {
          console.error("Lỗi khi lấy vị trí hoặc tính khoảng cách:", error);
        }
      },
      (error) => {
        alert("Không thể truy cập vị trí! Vui lòng kiểm tra cài đặt trình duyệt.");
      }
    );
  } else {
    alert("Trình duyệt không hỗ trợ lấy vị trí!");
  }
};

export default LocationPicker;
