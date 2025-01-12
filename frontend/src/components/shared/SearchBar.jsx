import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = (props) => {
  const {
    dropdownOptions = ["All", "Items", "Services"],
    onSearch,
    placeholder = "Search",
  } = props;

  const navigate = useNavigate();
  const handleSearchParent =
    onSearch ||
    ((query, type) => {
      navigate(
        `/listings/search?query=${encodeURIComponent(
          query
        )}&type=${encodeURIComponent(type)}`
      );
    });

  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownValue, setDropDownValue] = useState(dropdownOptions[0]);
  const [searchValue, setSearchValue] = useState("");

  const toggleDropDown = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const handleDropDown = (e) => {
    setDropDownValue(e.target.getAttribute("data-value"));
    setIsDropDownOpen(false);
  };

  const handleSearchValue = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    if (searchValue.trim() && handleSearchParent) {
      handleSearchParent(searchValue, dropDownValue);
      setSearchValue("");
    } else {
      handleSearchParent("", "");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={`relative flex items-center gap-0`}>
      {/* Dropdown */}
      <button className="btn m-1" onClick={toggleDropDown}>
        {dropDownValue.charAt(0).toUpperCase() +
          dropDownValue.slice(1).toLowerCase()}
      </button>
      {isDropDownOpen && (
        <ul className="menu absolute bg-base-100 rounded-box z-10 w-52 p-2 shadow top-full mt-1">
          {dropdownOptions.map((option) => (
            <li key={option}>
              <a onClick={handleDropDown} data-value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Search Input */}
      <label className="input w-full input-bordered flex items-center gap-2">
        <input
          type="text"
          className="grow"
          placeholder={placeholder}
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
