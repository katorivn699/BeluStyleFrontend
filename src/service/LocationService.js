import React, { useEffect, useState } from "react";

const LocationSelector = ({ onLocationChange }) => {
  const [tinh, setTinh] = useState([]);
  const [quan, setQuan] = useState([]);
  const [phuong, setPhuong] = useState([]);
  const [selectedTinh, setSelectedTinh] = useState("");
  const [selectedQuan, setSelectedQuan] = useState("");
  const [selectedPhuong, setSelectedPhuong] = useState("");

  useEffect(() => {
    // Lấy tỉnh thành
    fetch("https://esgoo.net/api-tinhthanh/1/0.htm")
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setTinh(data.data);
        }
      });
  }, []);

  const handleTinhChange = (e) => {
    const idtinh = e.target.value;
    setSelectedTinh(idtinh);
    setQuan([]); // Reset quận và phường khi thay đổi tỉnh
    setSelectedQuan("");
    setSelectedPhuong("");

    fetch(`https://esgoo.net/api-tinhthanh/2/${idtinh}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setQuan(data.data);
        }
      });
  };

  const handleQuanChange = (e) => {
    const idquan = e.target.value;
    setSelectedQuan(idquan);
    setPhuong([]); // Reset phường khi thay đổi quận
    setSelectedPhuong("");

    fetch(`https://esgoo.net/api-tinhthanh/3/${idquan}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setPhuong(data.data);
        }
      });
  };

  const handlePhuongChange = (e) => {
    const idphuong = e.target.value;
    setSelectedPhuong(idphuong);

    // Gọi hàm onLocationChange với tên đã chọn
    const tinhName = tinh.find((t) => t.id === selectedTinh)?.name || "";
    const quanName = quan.find((q) => q.id === selectedQuan)?.name || "";
    const phuongName = phuong.find((p) => p.id === idphuong)?.name || "";

    onLocationChange({ tinh: tinhName, quan: quanName, phuong: phuongName });
  };

  return (
    <div className="css_select_div space-x-7 text-xl">
      <select
        className="css_select border-gray-300 border-[1px] rounded-sm"
        id="province"
        name="province"
        title="Select Province"
        onChange={handleTinhChange}
      >
        <option value="0">Province</option>
        {tinh.map((t) => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      <select
        className="css_select border-gray-300 border-[1px] rounded-sm"
        id="district"
        name="district"
        title="Select District"
        onChange={handleQuanChange}
        disabled={!selectedTinh}
      >
        <option value="0">District</option>
        {quan.map((q) => (
          <option key={q.id} value={q.id}>
            {q.name}
          </option>
        ))}
      </select>

      <select
        className="css_select border-gray-300 border-[1px] rounded-sm"
        id="ward"
        name="ward"
        title="Select Ward"
        onChange={handlePhuongChange}
        disabled={!selectedQuan}
      >
        <option value="0">Ward</option>
        {phuong.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
