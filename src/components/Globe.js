import GlobeRender from "react-globe.gl";
import countryGeo from "./countries.geojson";
import { useEffect, useState, useRef } from "react";
import SearchBar from "./SearchBar";
export default function Globe() {
	const [countries, setCountries] = useState({ features: [] });
	const [hovered, setHovered] = useState();
	const [selected, setSelected] = useState();
	const [countryInfo, setCountryInfo] = useState([]);
	const [currentCountry, setCurrentCountry] = useState(null);
	const globeRef = useRef(null);

	let languages = "";

	useEffect(() => {
		fetch(countryGeo)
			.then((res) => res.json())
			.then(setCountries);

		fetch("https://restcountries.com/v3.1/all")
			.then((res) => res.json())
			.then(setCountryInfo);
	}, []);

	function setLanguages() {
		if (!currentCountry.languages) return "N/A";
		let languages = "";
		Object.entries(currentCountry.languages).forEach(([key, value]) => {
			if (
				key !==
				Object.keys(currentCountry.languages)[
					Object.keys(currentCountry.languages).length - 1
				]
			) {
				languages += value + ", ";
			} else {
				languages += value;
			}
		});
		return languages;
	}
	function setCurrencies() {
		if (!currentCountry.currencies) return "N/A";
		let currencies = "";
		Object.entries(currentCountry.currencies).forEach(([key, value]) => {
			if (
				key !==
				Object.keys(currentCountry.currencies)[
					Object.keys(currentCountry.currencies).length - 1
				]
			) {
				currencies += value.name + " (" + key + "), ";
			} else {
				currencies += value.name + " (" + key + ")";
			}
		});
		return currencies;
	}

	function handleLocation(lat, lng) {
		globeRef.current.pointOfView({ lat: lat, lng: lng, altitude: 2 }, 700);
	}

	function handleSearch(country) {
		let selectedCountry = countryInfo.filter((obj) => {
			return obj.name.common === country;
		})[0];
		setCurrentCountry(selectedCountry);
		handleLocation(selectedCountry.latlng?.[0], selectedCountry.latlng?.[1]);
		setSelected(null);
	}

	return (
		<div className="overflow-hidden">
			<div className="text-stone-100 p-4 bg-stone-900 w-[20rem] h-screen absolute left-0 top-0 z-10 flex flex-col">
				<h1 className="mb-4 text-2xl font-bold">Country Checker</h1>
				<SearchBar onCountrySelected={handleSearch}></SearchBar>
				{currentCountry && (
					<div className="flex flex-col gap-4 mt-16">
						<img
							className="self-center h-24"
							src={currentCountry.flags?.svg}
							alt="flag"
						></img>
						<div>
							<h3 className="text-lg font-bold">Country:</h3>
							<p className=" text-stone-300">
								{currentCountry.name?.official} <br />(
								{currentCountry.name?.common})
							</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">Continent:</h3>
							<p className=" text-stone-300">{currentCountry.continents[0]}</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">Capital:</h3>
							<p className=" text-stone-300">
								{currentCountry.capital === undefined
									? "N/A"
									: currentCountry.capital}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">Population:</h3>
							<p className=" text-stone-300">
								{currentCountry.population?.toLocaleString("en-US")}
							</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">Languages:</h3>
							<p className=" text-stone-300">{setLanguages()}</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">Currencies:</h3>
							<p className=" text-stone-300">{setCurrencies()}</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">Area:</h3>
							<p className=" text-stone-300">
								{currentCountry.area?.toLocaleString("en-US") + " "}
								sqft.
							</p>
						</div>
						<div>
							<h3 className="text-lg font-bold">UN Member:</h3>
							<p className=" text-stone-300">
								{currentCountry.unMember ? "Yes" : "No"}
							</p>
						</div>
					</div>
				)}
			</div>
			<GlobeRender
				ref={globeRef}
				globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
				backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
				lineHoverPrecision={0}
				polygonsData={countries.features}
				polygonAltitude={() => 0.009}
				polygonCapColor={(d) => {
					if (d === selected || currentCountry?.cca3 === d.properties.ISO_A3) {
						return "rgba(146, 220, 229,0.5)";
					} else if (d === hovered) {
						return "rgba(255,255,255,0.25)";
					} else {
						return "rgba(0,0,0,0.5)";
					}
				}}
				polygonSideColor={() => "#111"}
				polygonStrokeColor={() => "#FFF"}
				onPolygonHover={setHovered}
				polygonsTransitionDuration={400}
				polygonLabel={({ properties: d }) => `
        			<b>${d.ADMIN} (${d.ISO_A2})</b>
     			 `}
				onPolygonClick={(d) => {
					setSelected(d);
					let selectedCountry = countryInfo.filter((obj) => {
						return obj.cca3 === d.properties.ISO_A3;
					})[0];
					setCurrentCountry(selectedCountry);
					handleLocation(
						selectedCountry.latlng?.[0],
						selectedCountry.latlng?.[1]
					);
				}}
			></GlobeRender>
		</div>
	);
}
