import React from 'react';

const AttemptsInput = ({ attempts, setAttempts, t }) => {
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);

    // Validar que el valor esté dentro del rango permitido
    if (value >= 1 && value <= 10) {
      setAttempts(value);
    } else if (value < 1) {
      setAttempts(1); // Si es menor que 1, establecer en 1
    } else if (value > 10) {
      setAttempts(10); // Si es mayor que 10, establecer en 10
    }
  };

  return (
    <>
      {attempts.length > 0 && (
        <div>
          <label
            htmlFor="attempts"
            className="block text-sm font-medium text-gray-700"
          >
            {t("quizz.NumerQuizz")}
          </label>
          <input
            type="number"
            id="attempts"
            value={attempts}
            onChange={handleChange}
            min="1"
            max="10"
            inputMode="numeric" // Asegura el teclado numérico en móviles
            className={`mt-1 block w-full px-4 py-2 rounded-lg border`}
            required
          />
        </div>
      )}
    </>
  );
};

export default AttemptsInput;