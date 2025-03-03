import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const collections = [
    {
        id: 1,
        title: "Thiên đường kim cương",
        description: "Bộ sưu tập trang sức quyến rũ chứa đựng bản chất của sự thanh lịch và tinh tế vượt thời gian",
        image: "https://picsum.photos/id/1/200",
    },
    {
        id: 2,
        title: "Sói Bạc",
        description: "Bộ sưu tập trang sức quyến rũ phản ánh tinh thần hoang dã bất khuất.",
        image: "https://picsum.photos/id/1/200",
    },
    {
        id: 3,
        title: "Thiên đường đôi lứa",
        description: "Bộ sưu tập trang sức quyến rũ tôn vinh mối quan hệ tình yêu vĩnh cửu.",
        image: "https://picsum.photos/id/1/200",
    },
    {
        id: 4,
        title: "Dung Nham Hoàng Kim",
        description: "Bộ sưu tập trang sức rạng rỡ nắm bắt được bản chất của vàng nóng cháy.",
        image: "https://picsum.photos/id/1/200",
    }
    ,
    {
        id: 5,
        title: "Dung Nham Hoàng Kim",
        description: "Bộ sưu tập trang sức rạng rỡ nắm bắt được bản chất của vàng nóng cháy.",
        image: "https://picsum.photos/id/1/200",
    },
    {
        id: 6,
        title: "Dung Nham Hoàng Kim",
        description: "Bộ sưu tập trang sức rạng rỡ nắm bắt được bản chất của vàng nóng cháy.",
        image: "https://picsum.photos/id/1/200",
    }
];

const Collection = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredCollections, setFilteredCollections] = useState(collections);
    

    const handleSearch = () => {
        const filtered = collections.filter(collection =>
            collection.title.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
            collection.description.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
        setFilteredCollections(filtered);
    };


    return (
        <div className="min-h-screen bg-bgOuter mx-auto px-6 lg:px-20">
            <div className="text-white mb-4 flex justify-center">
                <Link to="/" className="text-gray-400">Trang chủ </Link> / Bộ sưu tập
            </div>
            {/* Search Bar */}
            <div className="mb-4 flex items-center justify-center px-4 py-4 mb-2">
                <div className="relative w-full max-w-lg">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bộ sưu tập tại đây"
                        className="pl-4 pr-12 py-2 w-full border border-white rounded-md bg-gray-400 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-md bg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                    </button>
                </div>
            </div>
            {/* Collection List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {filteredCollections.map((item, index) => (
                    <div key={item.id} className={`flex "md:flex-row" items-center`}>
                        <div className="relative w-1/2">
                            <div className="border border-yellow-500 p-2 rounded-lg">
                                <img src={item.image} alt={item.title} className="rounded-lg shadow-lg w-4/5" />
                            </div>
                        </div>
                        <div className="w-1/2 px-6">
                            <h2 className="text-white text-2xl italic">{item.title}</h2>
                            <p className="text-gray-300 mt-2">{item.description}</p>
                            <button className="mt-4 px-4 py-2 bg-white text-gray-800 rounded-full shadow-md hover:bg-gray-200 transition">
                                Xem Chi Tiết
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Collection;