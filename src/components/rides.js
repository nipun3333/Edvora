import React, { useEffect, useState } from 'react'
import { FilterIcon, DropDownIcon } from '../assets/icon'
import axios from 'axios';
import Moment from 'moment';

export default function Rides({ user }) {
    const [currentPage, setCurrentPage] = useState("nearest");
    const [rides, setRides] = useState([]);
    const [rides1, setRides1] = useState([]);
    const [openFilter, setOpenFilter] = useState(false);
    // const [cities, setCities] = useState([]);
    const [statesCities, setStatesCities] = useState({});
    const [citiesOpen, setCitiesOpen] = useState(false);
    const [statesOpen, setStatesOpen] = useState(false);
    const [currState, setCurrState] = useState("");
    const [currCity, setCurrCity] = useState("");
    console.log(statesCities);
    useEffect(() => {
        axios.get("http://assessment.api.vweb.app/rides")
            .then(res => {
                setRides((res.data.map((dt) => {
                    var temp = 1000000000;
                    var stateName = dt.state;
                    dt.station_path.map((st) => {
                        temp = Math.min(Math.abs(user.station_code - st), temp);
                    })
                    if (Object.keys(statesCities).indexOf(dt.state) > -1) {
                        if (!statesCities[dt.state].includes(dt.city)) {
                            setStatesCities(statesCities => ({ ...statesCities, [dt.state]: [...statesCities[dt.state], dt.city] }))
                        }
                    }
                    else {
                        setStatesCities(statesCities => ({ ...statesCities, [dt.state]: [dt.city] }))
                    }

                    return { ...dt, distance: temp };
                })).sort((a, b) => a.distance > b.distance ? 1 : -1));

                setRides1((res.data.map((dt) => {
                    var temp = 1000000000;
                    dt.station_path.map((st) => {
                        temp = Math.min(Math.abs(user.station_code - st), temp);
                    })
                    return { ...dt, distance: temp };
                })).sort((a, b) => a.distance > b.distance ? 1 : -1));
            })
    }, [user]);

    console.log(citiesOpen);

    return (
        <div className='bg-background2 h-full px-10 py-7'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-11'>
                    <div className='w-fit cursor-pointer'>
                        <p
                            className={currentPage === "nearest" ? "font-bold text-lg border-b-2 text-white" : "font-normal text-lg text-gray"}
                            onClick={() => {
                                setCurrentPage("nearest");
                                setRides(rides1);
                            }}
                        >
                            Nearest rides
                        </p>
                    </div>
                    <div className='w-fit cursor-pointer'>
                        <p

                            className={currentPage === "upcoming" ? "font-bold text-lg border-b-2 text-white" : "font-normal text-lg text-gray"}
                            onClick={() => {
                                setCurrentPage("upcoming");
                                setRides(rides1.filter((ride) => {
                                    // return (Date(ride.date).getTime())>(Date.now().getTime());
                                    var d1 = new Date();
                                    var d2 = new Date(ride.date);
                                    return (d1.getTime() < d2.getTime());
                                }))
                            }}
                        >
                            Upcoming rides
                        </p>
                    </div>
                    <div className='w-fit cursor-pointer'>
                        <p

                            className={currentPage === "past" ? "font-bold text-lg border-b-2 text-white" : "font-normal text-lg text-gray"}
                            onClick={() => {
                                setCurrentPage("past");
                                setRides(rides1.filter((ride) => {
                                    // return (Date(ride.date).getTime())>(Date.now().getTime());
                                    var d1 = new Date();
                                    var d2 = new Date(ride.date);
                                    return (d1.getTime() > d2.getTime());
                                }))
                            }}
                        >
                            Past rides
                        </p>
                    </div>
                </div>

                <div>
                    <div className='flex gap-2 items-center cursor-pointer' onClick={() => setOpenFilter(!openFilter)}>
                        <FilterIcon />
                        <p className='text-white font-medium text-base'>Filter</p>
                    </div>
                    {openFilter === true ?
                        <div className='absolute bg-background4 top-36 right-10 py-6 px-8 rounded-2xl w-2/12'>
                            <p className='text-xl font-light text-gray2 ml-3'>Filters</p>
                            <hr className='w-full text-gray3 mt-3' />

                            <div className='px-3 py-2 bg-background5 mt-5 rounded-md cursor-pointer'>
                                <div className='flex justify-between items-center'
                                    onClick={() => {
                                        setStatesOpen(!statesOpen);
                                        setCitiesOpen(false);
                                    }}>
                                    <p className='font-normal text-white text-base'>State</p>
                                    <div>
                                        <DropDownIcon />
                                    </div>
                                </div>
                            </div>
                            <div className='absolute rounded-md cursor-pointer' style={{ width: "176px" }}>
                                {statesOpen ?
                                    <div>
                                        <div className='bg-background5 max-h-72 overflow-auto '>
                                            {Object.keys(statesCities).map((key) => {
                                                return (
                                                    <div className='py-2 px-3 hover:bg-gray rounded-md'
                                                        onClick={() => {
                                                            setCurrState(key);
                                                            setCurrCity("");
                                                            setStatesOpen(false);
                                                        }}>
                                                        <p className='text-white hover:text-black'>{key}</p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    :
                                    <>

                                    </>
                                }
                            </div>

                            <div className='px-3 py-2 bg-background5 mt-5 rounded-md cursor-pointer'>
                                <div className='flex justify-between items-center'
                                    onClick={() => {
                                        setCitiesOpen(!citiesOpen);
                                        setStatesOpen(false);
                                    }}>
                                    <p className='font-normal text-white text-base'>City</p>
                                    <div>
                                        <DropDownIcon />
                                    </div>
                                </div>
                            </div>
                            <div className='absolute rounded-md cursor-pointer' style={{ width: "176px" }}>
                                {citiesOpen ?
                                    <div>
                                        <div className='bg-background5 max-h-72 overflow-auto '>
                                            {currState === "" ?
                                                (
                                                    <div className='py-2 px-3 rounded-md' style={{ backgroundColor: "(0, 0, 0)" }}>
                                                        <p className='text-gray2'>Select a State</p>
                                                    </div>
                                                )
                                                :
                                                (
                                                    statesCities[currState].map((city) => {
                                                        return (
                                                            <div className='py-2 px-3 hover:bg-gray rounded-md'
                                                                onClick={() => {
                                                                    setCurrCity(city);
                                                                    setCitiesOpen(false);
                                                                }}>
                                                                <p className='text-white hover:text-black'>{city}</p>
                                                            </div>
                                                        )
                                                    })
                                                )
                                            }
                                        </div>
                                    </div>
                                    :
                                    <>

                                    </>
                                }
                            </div>

                        </div>
                        :
                        <>
                        </>
                    }
                </div>
            </div>

            <div className='mt-6'>
                <div className='flex flex-col gap-3'>
                    {rides.map((ride) => {
                        return (
                            <>
                                {currState === "" ?

                                    <div className='py-6 px-7 bg-background3 rounded-xl flex justify-between'>
                                        <div className='flex gap-11 items-center'>
                                            <img src={ride.map_url} alt="" className='rounded-md w-72 h-36' />
                                            <div className='flex flex-col gap-2'>
                                                <div className='font-medium flex gap-0.5'>
                                                    <p className='text-gray '>Ride Id :</p>
                                                    <p className='text-white'>{ride.id}</p>
                                                </div>
                                                <div className='font-medium flex gap-0.5'>
                                                    <p className='text-gray '>Origin Station :</p>
                                                    <p className='text-white'>{ride.origin_station_code}</p>
                                                </div>
                                                <div className='font-medium flex gap-0.5'>
                                                    <p className='text-gray '>station_path :</p>
                                                    <p className='text-white'>{ride.station_path}</p>
                                                </div>
                                                <div className='font-medium flex gap-0.5'>
                                                    <p className='text-gray '>Date :</p>
                                                    <p className='text-white'>{Moment(ride.date).format("Do MMM YYYY HH:MM")}</p>
                                                </div>
                                                <div className='font-medium flex gap-0.5'>
                                                    <p className='text-gray '>Distance :</p>
                                                    <p className='text-white'>{ride.distance}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <div className='flex gap-6 items-center'>
                                                <div
                                                    className='px-2.5 py-0.5 text-white bg-gray w-fit rounded-2xl'
                                                    style={{ "background": "rgba(0, 0, 0, 0.56)" }}
                                                >
                                                    <p>City Name</p>
                                                </div>
                                                <div
                                                    className='px-2.5 py-0.5 text-white bg-gray w-fit rounded-2xl'
                                                    style={{ "background": "rgba(0, 0, 0, 0.56)" }}
                                                >
                                                    <p>State Name</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    :
                                    (
                                        currCity === "" ?
                                            (currState === ride.state ?
                                                <div className='py-6 px-7 bg-background3 rounded-xl flex justify-between'>
                                                    <div className='flex gap-11 items-center'>
                                                        <img src={ride.map_url} alt="" className='rounded-md w-72 h-36' />
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Ride Id :</p>
                                                                <p className='text-white'>{ride.id}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Origin Station :</p>
                                                                <p className='text-white'>{ride.origin_station_code}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>station_path :</p>
                                                                <p className='text-white'>{ride.station_path}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Date :</p>
                                                                <p className='text-white'>{Moment(ride.date).format("Do MMM YYYY HH:MM")}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Distance :</p>
                                                                <p className='text-white'>{ride.distance}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className='flex gap-6 items-center'>
                                                            <div
                                                                className='px-2.5 py-0.5 text-white bg-gray w-fit rounded-2xl'
                                                                style={{ "background": "rgba(0, 0, 0, 0.56)" }}
                                                            >
                                                                <p>City Name</p>
                                                            </div>
                                                            <div
                                                                className='px-2.5 py-0.5 text-white bg-gray w-fit rounded-2xl'
                                                                style={{ "background": "rgba(0, 0, 0, 0.56)" }}
                                                            >
                                                                <p>State Name</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <></>
                                            )

                                            :

                                            ((currState === ride.state && currCity === ride.city) ?
                                                <div className='py-6 px-7 bg-background3 rounded-xl flex justify-between'>
                                                    <div className='flex gap-11 items-center'>
                                                        <img src={ride.map_url} alt="" className='rounded-md w-72 h-36' />
                                                        <div className='flex flex-col gap-2'>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Ride Id :</p>
                                                                <p className='text-white'>{ride.id}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Origin Station :</p>
                                                                <p className='text-white'>{ride.origin_station_code}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>station_path :</p>
                                                                <p className='text-white'>{ride.station_path}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Date :</p>
                                                                <p className='text-white'>{Moment(ride.date).format("Do MMM YYYY HH:MM")}</p>
                                                            </div>
                                                            <div className='font-medium flex gap-0.5'>
                                                                <p className='text-gray '>Distance :</p>
                                                                <p className='text-white'>{ride.distance}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className='flex gap-6 items-center'>
                                                            <div
                                                                className='px-2.5 py-0.5 text-white bg-gray w-fit rounded-2xl'
                                                                style={{ "background": "rgba(0, 0, 0, 0.56)" }}
                                                            >
                                                                <p>City Name</p>
                                                            </div>
                                                            <div
                                                                className='px-2.5 py-0.5 text-white bg-gray w-fit rounded-2xl'
                                                                style={{ "background": "rgba(0, 0, 0, 0.56)" }}
                                                            >
                                                                <p>State Name</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                :
                                                <></>
                                            )

                                    )
                                }
                            </>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}