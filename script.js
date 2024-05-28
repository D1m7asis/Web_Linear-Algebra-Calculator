document.addEventListener("DOMContentLoaded", function() {
    // Элементы DOM
    const taskSelect = document.getElementById("task");
    const dimensionSelect = document.getElementById("dimension");
    const inputContainer = document.getElementById("input-container");
    const outputContainer = document.getElementById("output-container");
    const calculateButton = document.getElementById("calculate");
    const dimensionContainer = document.getElementById("dimension-container");
    const matrixDimensionsContainer = document.getElementById("matrix-dimensions-container");
    const rows1Input = document.getElementById("rows1");
    const cols1Input = document.getElementById("cols1");
    const rows2Input = document.getElementById("rows2");
    const cols2Input = document.getElementById("cols2");

    // Обработчики событий
    taskSelect.addEventListener("change", updateInputFields);
    dimensionSelect.addEventListener("change", updateInputFields);
    rows1Input.addEventListener("change", updateInputFields);
    cols1Input.addEventListener("change", updateInputFields);
    rows2Input.addEventListener("change", updateInputFields);
    cols2Input.addEventListener("change", updateInputFields);
    calculateButton.addEventListener("click", performCalculation);

    // Функция обновления полей ввода на основе выбранной задачи и размерности
    function updateInputFields() {
        const task = taskSelect.value;
        const dimension = parseInt(dimensionSelect.value);
        inputContainer.innerHTML = '';
        outputContainer.innerHTML = '';

        if (task === 'rectangular-matrix-multiply') {
            // Отображаем поля для ввода размерностей обеих матриц
            dimensionContainer.style.display = 'none';
            matrixDimensionsContainer.style.display = 'block';
            createRectangularMatrixInputs(
                parseInt(rows1Input.value), parseInt(cols1Input.value),
                parseInt(rows2Input.value), parseInt(cols2Input.value)
            );
        } else {
            // Отображаем выбор размерности
            dimensionContainer.style.display = 'block';
            matrixDimensionsContainer.style.display = 'none';
            switch (task) {
                case 'matrix-sum':
                case 'square-matrix-multiply':
                    createMatrixInputs(2, dimension);
                    break;
                case 'transpose':
                    createMatrixInputs(1, dimension);
                    break;
                case 'scalar-product':
                    createVectorInputs(2, dimension);
                    break;
                case 'vector-product':
                    if (dimension !== 3) {
                        alert("Vector product is defined only for 3-dimensional vectors.");
                    } else {
                        createVectorInputs(2, dimension);
                    }
                    break;
                case 'mixed-product':
                    if (dimension !== 3) {
                        alert("Mixed product is defined only for 3-dimensional vectors.");
                    } else {
                        createVectorInputs(3, dimension);
                    }
                    break;
                case 'vector-basis':
                    createBasisInputs(dimension);
                    break;
            }
        }
    }

    // Создание полей ввода для матриц
    function createMatrixInputs(numMatrices, size) {
        for (let i = 0; i < numMatrices; i++) {
            const matrixContainer = document.createElement("div");
            matrixContainer.classList.add("matrix");
            matrixContainer.style.setProperty('--cols', size);

            for (let row = 0; row < size; row++) {
                for (let col = 0; col < size; col++) {
                    const input = document.createElement("input");
                    input.type = "number";
                    input.classList.add("matrix-input");
                    matrixContainer.appendChild(input);
                }
            }

            inputContainer.appendChild(matrixContainer);
        }
    }

    // Создание полей ввода для прямоугольных матриц
    function createRectangularMatrixInputs(rows1, cols1, rows2, cols2) {
        // Первая матрица
        const matrix1Container = document.createElement("div");
        matrix1Container.classList.add("matrix");
        matrix1Container.style.setProperty('--cols', cols1);

        for (let row = 0; row < rows1; row++) {
            for (let col = 0; col < cols1; col++) {
                const input = document.createElement("input");
                input.type = "number";
                input.classList.add("matrix-input");
                matrix1Container.appendChild(input);
            }
        }
        inputContainer.appendChild(matrix1Container);

        // Вторая матрица
        const matrix2Container = document.createElement("div");
        matrix2Container.classList.add("matrix");
        matrix2Container.style.setProperty('--cols', cols2);

        for (let row = 0; row < rows2; row++) {
            for (let col = 0; col < cols2; col++) {
                const input = document.createElement("input");
                input.type = "number";
                input.classList.add("matrix-input");
                matrix2Container.appendChild(input);
            }
        }
        inputContainer.appendChild(matrix2Container);
    }

    // Создание полей ввода для векторов
    function createVectorInputs(numVectors, size) {
        for (let i = 0; i < numVectors; i++) {
            const vectorContainer = document.createElement("div");
            vectorContainer.classList.add("vector");

            for (let j = 0; j < size; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.classList.add("vector-input");
                vectorContainer.appendChild(input);
            }

            inputContainer.appendChild(vectorContainer);
        }
    }

    // Создание полей ввода для базисных векторов и вектора
    function createBasisInputs(size) {
        const vectorLabels = ["Vector", "Basis Vector 1", "Basis Vector 2", "Basis Vector 3"];
        for (let i = 0; i < 4; i++) {
            const vectorContainer = document.createElement("div");
            vectorContainer.classList.add("vector");

            const label = document.createElement("label");
            label.textContent = vectorLabels[i];
            inputContainer.appendChild(label);

            for (let j = 0; j < size; j++) {
                const input = document.createElement("input");
                input.type = "number";
                input.classList.add("vector-input");
                vectorContainer.appendChild(input);
            }

            inputContainer.appendChild(vectorContainer);
        }
    }

    // Функция выполнения расчетов на основе выбранной задачи
    function performCalculation() {
        const task = taskSelect.value;
        let result;

        try {
            switch (task) {
                case 'matrix-sum':
                    result = calculateMatrixSum();
                    break;
                case 'transpose':
                    result = calculateTranspose();
                    break;
                case 'square-matrix-multiply':
                    result = calculateSquareMatrixMultiply();
                    break;
                case 'rectangular-matrix-multiply':
                    result = calculateRectangularMatrixMultiply();
                    break;
                case 'scalar-product':
                    result = calculateScalarProduct();
                    break;
                case 'vector-product':
                    result = calculateVectorProduct();
                    break;
                case 'mixed-product':
                    result = calculateMixedProduct();
                    break;
                case 'vector-basis':
                    result = calculateVectorInBasis();
                    break;
            }
        } catch (error) {
            result = `Error: ${error.message}`;
        }

        outputContainer.innerHTML = `<pre>${result}</pre>`;
    }

    // Функция расчета суммы матриц
    function calculateMatrixSum() {
        const matrices = getMatricesFromInputs(2);
        const sum = math.add(matrices[0], matrices[1]);
        return matrixToString(sum);
    }

    // Функция расчета транспонированной матрицы
    function calculateTranspose() {
        const matrices = getMatricesFromInputs(1);
        const transpose = math.transpose(matrices[0]);
        return matrixToString(transpose);
    }

    // Функция расчета произведения квадратных матриц
    function calculateSquareMatrixMultiply() {
        const matrices = getMatricesFromInputs(2);
        const product = math.multiply(matrices[0], matrices[1]);
        return matrixToString(product);
    }

// Функция расчета произведения прямоугольных матриц
	function calculateRectangularMatrixMultiply() {
		const rows1 = parseInt(rows1Input.value);
		const cols1 = parseInt(cols1Input.value);
		const rows2 = parseInt(rows2Input.value);
		const cols2 = parseInt(cols2Input.value);
	
		if (cols1 !== rows2) {
			throw new Error("Number of columns in Matrix 1 must equal the number of rows in Matrix 2.");
		}
	
		const matrices = getRectangularMatricesFromInputs(rows1, cols1, rows2, cols2);
		const product = math.multiply(matrices[0], matrices[1]);
		return matrixToString(product);
	}


	// Функция расчета скалярного произведения векторов и проекции
	function calculateScalarProduct() {
		const vectors = getVectorsFromInputs(2);
		const dotProduct = math.dot(vectors[0], vectors[1]);
		const length1 = math.norm(vectors[0]);
		const length2 = math.norm(vectors[1]);
	
		let result = `Dot Product: ${dotProduct}\n`;
		result += `Length of Vector 1: ${length1}\n`;
		result += `Length of Vector 2: ${length2}\n`;
	
		// Если длина второго вектора ненулевая, то вычисляем проекцию
		if (length2 !== 0) {
			const projection = dotProduct / length2;
			
			result += `Projection of Vector 1 on Vector 2: ${projection}\n`;
		} else {
			result += `Projection of Vector 1 on Vector 2: undefined (division by zero)\n`;
		}
	
		return result;
	}


	// Функция расчета векторного произведения
	function calculateVectorProduct() {
		const vectors = getVectorsFromInputs(2);
		const crossProduct = math.cross(vectors[0], vectors[1]);
		const area = math.norm(crossProduct);
	
		let result = `Cross Product: \{${crossProduct.join('; ')}\}\n`; // Преобразуем векторное произведение в строку
		result += `Area of Parallelogram: ${area}\n`;
	
		return result;
	}

    // Функция расчета смешанного произведения
    function calculateMixedProduct() {
        const vectors = getVectorsFromInputs(3);
        const mixedProduct = math.dot(vectors[0], math.cross(vectors[1], vectors[2]));
        const volume = Math.abs(mixedProduct);

        let result = `Mixed Product: ${mixedProduct}\n`;
        result += `Volume of Parallelepiped: ${volume}\n`;

        return result;
    }

    // Функция расчета координат вектора в заданном базисе
    function calculateVectorInBasis() {
        const vectors = getVectorsFromInputs(4);
        const [v, b1, b2, b3] = vectors;

        const B = math.transpose([b1, b2, b3]);
        const coords = math.lusolve(B, v);
        const length = math.norm(v);

        let result = `Coordinates in Basis: ${vectorToString(coords)}\n`;
        result += `Length of Vector: ${length}\n`;

        return result;
    }

    // Получение матриц из полей ввода
    function getMatricesFromInputs(numMatrices) {
        const matrices = [];
        const matrixElements = document.getElementsByClassName("matrix");

        for (let i = 0; i < numMatrices; i++) {
            const matrix = [];
            const inputs = matrixElements[i].getElementsByClassName("matrix-input");

            let rows = matrixElements[i].children.length / parseInt(cols1Input.value);
            for (let row = 0; row < rows; row++) {
                const rowArray = [];
                for (let col = 0; col < parseInt(cols1Input.value); col++) {
                    rowArray.push(parseFloat(inputs[row * parseInt(cols1Input.value) + col].value));
                }
                matrix.push(rowArray);
            }

            matrices.push(matrix);
        }

        return matrices;
    }

	// Получение прямоугольных матриц из полей ввода
	function getRectangularMatricesFromInputs(rows1, cols1, rows2, cols2) {
		const matrices = [];
		const matrixElements = document.getElementsByClassName("matrix");
	
		for (let i = 0; i < 2; i++) {
			const matrix = [];
			const inputs = matrixElements[i].getElementsByClassName("matrix-input");
	
			let rows = i === 0 ? rows1 : rows2;
			let cols = i === 0 ? cols1 : cols2;
			for (let row = 0; row < rows; row++) {
				const rowArray = [];
				for (let col = 0; col < cols; col++) {
					rowArray.push(parseFloat(inputs[row * cols + col].value));
				}
				matrix.push(rowArray);
			}
	
			matrices.push(matrix);
		}
	
		return matrices;
	}

    // Получение векторов из полей ввода
    function getVectorsFromInputs(numVectors) {
        const vectors = [];
        const vectorElements = document.getElementsByClassName("vector");

        for (let i = 0; i < numVectors; i++) {
            const vector = [];
            const inputs = vectorElements[i].getElementsByClassName("vector-input");

            for (let j = 0; j < inputs.length; j++) {
                vector.push(parseFloat(inputs[j].value));
            }

            vectors.push(vector);
        }

        return vectors;
    }

    // Преобразование матрицы в строку для отображения
    function matrixToString(matrix) {
        return matrix.map(row => row.join(' ')).join('\n');
    }

    // Преобразование вектора в строку для отображения
    function vectorToString(vector) {
        return vector.map(v => v[0]).join(' ');
    }

    // Первоначальная настройка полей ввода
    updateInputFields();
});
