import { useState, useEffect } from 'react';
import './styles/tailwind.css'; 
import { Link,useNavigate } from 'react-router-dom';
import Modal from './modal';
const GuesserCardComponent = () => {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [score, setScore] = useState(0);
    const [totalGuesses, setTotalGuesses] = useState(0);
    const [country, setCountry] = useState(null);
    const [togglestate,setTogglestate]=useState(false)
    const [tempName, setTempName] = useState("");

    useEffect(() => {
        var requestOptions = {
            method: 'GET'
          };
          
          fetch("http://localhost:8000/random", requestOptions)
            .then(response => response.json())
            .then(result => setCountry(result))
            .then(console.log("this"))
            .catch(error => console.log('error', error));
    }, [togglestate]);


    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleButtonClick = () => {
        setTempName(country.name);
        setIsLoading(true);
        if (inputValue.toLowerCase() === country.name.toLowerCase()) {
            setIsAnswerCorrect(true);
            setScore(score + 1);
        } else {
            setModalIsOpen(true);
            setIsAnswerCorrect(false);
        }
        setInputValue('');
        setTotalGuesses(totalGuesses + 1);
        setIsLoading(false);
        setTogglestate(!togglestate)
        console.log(togglestate)
    };

    if (!country) {
        return <div>Loading...</div>;
    }
    const closeModal = () => {
        setModalIsOpen(false);
      };
    return (


            <div>
         
            <p className="mb-4">Score: {score} ({((score / totalGuesses) * 100).toFixed(2)}%)</p>
            <p className="mb-4">Guess the country: {country.capital} is its capital.</p>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                className="border border-gray-300 rounded-md p-2 mb-2"
                placeholder="Enter your guess"
                onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                        handleButtonClick();
                    }
                }}
            />
            <button
                onClick={handleButtonClick}
                className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
            >
                {isLoading ? 'Loading...' : 'Check Answer'}
            </button>
            {isLoading && <p className="mt-2">Checking answer...</p>}
            {isAnswerCorrect && <div className="checkmark"></div>}
{!isAnswerCorrect && totalGuesses > 0 && <div className="cross"></div>}
            <Modal isOpen={modalIsOpen} correctAnswer={tempName} onClose={closeModal} ></Modal>
        </div>
    );
};
export default GuesserCardComponent;
