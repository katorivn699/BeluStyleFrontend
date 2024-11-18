import React, { useEffect, useState } from "react";

const LocationSelector = ({ onLocationChange, initialAddress }) => {
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

          // Tách địa chỉ ban đầu và thiết lập giá trị
          if (initialAddress) {
            const [, phuongName, quanName, tinhName] = initialAddress.split(", ").map((part) => part.trim());

            // Tìm tỉnh theo tên và thiết lập
            const foundTinh = data.data.find((t) => t.name === tinhName);
            if (foundTinh) {
              setSelectedTinh(foundTinh.id);
              loadQuan(foundTinh.id, quanName, phuongName);
            }
          }
        }
      });
  }, [initialAddress]);

  const loadQuan = (tinhId, quanName, phuongName) => {
    fetch(`https://esgoo.net/api-tinhthanh/2/${tinhId}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setQuan(data.data);

          // Tìm quận theo tên và thiết lập
          const foundQuan = data.data.find((q) => q.name === quanName);
          if (foundQuan) {
            setSelectedQuan(foundQuan.id);
            loadPhuong(foundQuan.id, phuongName);
          }
        }
      });
  };

  const loadPhuong = (quanId, phuongName) => {
    fetch(`https://esgoo.net/api-tinhthanh/3/${quanId}.htm`)
      .then((response) => response.json())
      .then((data) => {
        if (data.error === 0) {
          setPhuong(data.data);

          // Tìm phường theo tên và thiết lập
          const foundPhuong = data.data.find((p) => p.name === phuongName);
          if (foundPhuong) {
            setSelectedPhuong(foundPhuong.id);

            // Gửi dữ liệu ban đầu đến callback
            onLocationChange({
              tinh: tinh.find((t) => t.id === selectedTinh)?.name || "",
              quan: quan.find((q) => q.id === selectedQuan)?.name || "",
              phuong: phuong.find((p) => p.id === foundPhuong.id)?.name || "",
            });
          }
        }
      });
  };

  const handleTinhChange = (e) => {
    const idtinh = e.target.value;
    setSelectedTinh(idtinh);
    setQuan([]);
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
    setPhuong([]);
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

    const tinhName = tinh.find((t) => t.id === selectedTinh)?.name || "";
    const quanName = quan.find((q) => q.id === selectedQuan)?.name || "";
    const phuongName = phuong.find((p) => p.id === idphuong)?.name || "";

    onLocationChange({ tinh: tinhName, quan: quanName, phuong: phuongName });
  };

  useEffect(() => {
    // Gửi dữ liệu cho cha khi tất cả các dropdown đã được khởi tạo
    if (selectedTinh && selectedQuan && selectedPhuong) {
      const tinhName = tinh.find((t) => t.id === selectedTinh)?.name || "";
      const quanName = quan.find((q) => q.id === selectedQuan)?.name || "";
      const phuongName = phuong.find((p) => p.id === selectedPhuong)?.name || "";
  
      onLocationChange({ tinh: tinhName, quan: quanName, phuong: phuongName });
    }
  }, [selectedTinh, selectedQuan, selectedPhuong, tinh, quan, phuong]);
  

  return (
    <div className="css_select_div space-x-7 text-xl">
      <select
        className="css_select border-gray-300 border-[1px] rounded-md"
        id="province"
        name="province"
        title="Select Province"
        onChange={handleTinhChange}
        value={selectedTinh}
      >
        <option value="">Province</option>
        {tinh.map((t) => (
          <option key={t.id} value={t.id}>
            {t.full_name}
          </option>
        ))}
      </select>

      <select
        className="css_select border-gray-300 border-[1px] rounded-md"
        id="district"
        name="district"
        title="Select District"
        onChange={handleQuanChange}
        value={selectedQuan}
        disabled={!selectedTinh}
      >
        <option value="">District</option>
        {quan.map((q) => (
          <option key={q.id} value={q.id}>
            {q.full_name}
          </option>
        ))}
      </select>

      <select
        className="css_select border-gray-300 border-[1px] rounded-md"
        id="ward"
        name="ward"
        title="Select Ward"
        onChange={handlePhuongChange}
        value={selectedPhuong}
        disabled={!selectedQuan}
      >
        <option value="">Ward</option>
        {phuong.map((p) => (
          <option key={p.id} value={p.id}>
            {p.full_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSelector;
