import { useEffect, useState } from "react";
import "./Graph.css";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import vacationsService from "../../../Services/VacationsService";
import VacationModel from "../../../Models/VacationModel";
import { NavLink } from "react-router-dom";
import notifyService from "../../../Services/NotifyService";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function Graph(): JSX.Element {

    const [vacations, setVacations] = useState<VacationModel[]>([]);

    useEffect(() => {
        const getVacations = async () => {
            try {
                const vacationsArr = await vacationsService.getAllVacations();
                setVacations(vacationsArr);
            }
            catch (err) {
                notifyService.error(err);
                console.log( err );
            }
        }
        getVacations();
    }, [setVacations,vacationsService,notifyService]); 

    let vacationsLocation = [];
    let amountOfFollowers = [];

    for (let index = 0; index < vacations.length; index++) {
        vacationsLocation[index] = vacations[index].destination;
        amountOfFollowers[index] = vacations[index].followersCount;
    }

    const options = {
        barPercentage: 0.5,
        scales: {
            y: {
                ticks: {
                    stepSize: 1,
                    beginAtZero: true,
                },
                beginAtZero: true,
            },
        },
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
        },
    };

    const labels = vacationsLocation;
    const data = {
        labels,
        datasets: [
            {
                label: "Number of followers",
                data: amountOfFollowers?.map((follower) => follower),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                    'rgba(255, 205, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(201, 203, 207, 0.5)'
                ],
                borderColor: [
                    'rgb(255, 99, 132)',
                    'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(75, 192, 192)',
                    'rgb(54, 162, 235)',
                    'rgb(153, 102, 255)',
                    'rgb(201, 203, 207)'
                ],
                borderWidth: 1
            }
        ],
    };

    return (
        <div className="Graph">
            <div style={{ position: 'fixed', top: '60px', right: '10px' }}>
                <NavLink to="/vacations/new">New Vacation</NavLink>
                <br />
                <NavLink to="/vacations">Vacations</NavLink>
            </div>
            <div className="bar">
                <Bar options={options} data={data} />
            </div>
        </div>
    );

}


export default Graph;
