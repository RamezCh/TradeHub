import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState("All");
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const toggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const handleDropDown = (e) => {
    setDropDownValue(e.target.getAttribute("data-value"));
    setIsDropDownOpen(false);
  };

  const handleSearch = () => {
    if (searchValue.trim()) {
      navigate(
        `/listings/search?query=${encodeURIComponent(
          searchValue
        )}&type=${encodeURIComponent(dropDownValue)}`
      );

      setSearchValue("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center gap-0">
      {/* Dropdown */}
      <button className="btn m-1" onClick={toggleDropDown}>
        {dropDownValue}
      </button>
      {isDropDownOpen && (
        <ul className="menu absolute bg-base-100 rounded-box z-10 w-52 p-2 shadow top-full mt-1">
          <li>
            <a onClick={handleDropDown} data-value="All">
              All
            </a>
          </li>
          <li>
            <a onClick={handleDropDown} data-value="Items">
              Items
            </a>
          </li>
          <li>
            <a onClick={handleDropDown} data-value="Services">
              Services
            </a>
          </li>
        </ul>
      )}

      {/* Search Input */}
      <label className="input w-full input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder="Search"
          value={searchValue}
          onChange={handleSearchValue}
          onKeyDown={handleKeyDown}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70 cursor-pointer"
          onClick={handleSearch}
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>
    </div>
  );
};

export default SearchBar;
