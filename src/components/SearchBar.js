import { useRef, useEffect, useState } from "react";

export default function SearchBar(props) {
	const searchRef = useRef();
	const [isLoading, setIsLoading] = useState(true);
	const [loadedCountry, setLoadedCountry] = useState([]);
	const [suggestedCountry, setSuggestedCountry] = useState([]);
	const [loadedFlag, setLoadedFlag] = useState([]);

	function onCountrySelected(country) {
		props.onCountrySelected(country);
		setSuggestedCountry([]);
		searchRef.current.value = "";
	}

	const onInputChange = (event) => {
		if (event.target.value !== "")
			setSuggestedCountry(
				loadedCountry.filter((country) =>
					country.toLowerCase().includes(event.target.value.toLowerCase())
				)
			);
		else setSuggestedCountry([]);
	};

	useEffect(() => {
		const url = "https://restcountries.com/v3.1/all/";
		fetch(url)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setIsLoading(false);

				const countryNames = data.map(
					(country) => (country = country.name.common)
				);
				const countryFlags = data.map(
					(country) => (country = country.flags.svg)
				);
				setLoadedCountry(countryNames);
				setLoadedFlag(countryFlags);
			});
	}, []);

	if (isLoading) {
		return <p>Loading...</p>;
	}

	return (
		<div className="w-full gap-1">
			<div className="w-full">
				<input
					onChange={onInputChange}
					autoComplete="off"
					id="search"
					ref={searchRef}
					className="w-full p-2 rounded bg-stone-800"
					type="text"
					placeholder="Find a country"
				></input>
			</div>
			<ul className="absolute flex flex-col max-h-full gap-4 p-4 overflow-y-auto custom-scroll bg-opacity-80 top-32 bg-stone-900">
				{suggestedCountry.map((option, index) => {
					return (
						<button
							key={index}
							onClick={() => onCountrySelected(option)}
							className=""
						>
							<img
								className="h-48"
								src={loadedFlag[loadedCountry.indexOf(option)]}
							></img>
							{option}
						</button>
					);
				})}
			</ul>
		</div>
	);
}
