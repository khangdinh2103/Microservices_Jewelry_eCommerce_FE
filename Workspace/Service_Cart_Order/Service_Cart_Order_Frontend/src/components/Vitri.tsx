const handleGetCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Trình duyệt không hỗ trợ lấy vị trí!");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        
        if (data && data.display_name) {
          setUserInfo((prev) => ({
            ...prev,
            address: data.display_name, 
          }));
        } else {
          alert("Không tìm thấy địa chỉ!");
        }
      } catch (error) {
        alert("Lỗi khi lấy địa chỉ!");
        console.error(error);
      }
    },
    (error) => {
      alert("Không thể lấy vị trí: " + error.message);
    }
  );
};
