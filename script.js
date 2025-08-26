class GymRoutineApp {
    constructor() {
        this.currentWorkout = [];
        this.workoutHistory = this.loadHistory();
        this.initializeApp();
    }

    initializeApp() {
        this.setupEventListeners();
        this.updateWorkoutSummary();
        this.renderWorkoutHistory();
    }

    setupEventListeners() {
        // Form submission
        document.getElementById('workoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addExercise();
        });

        // Save workout button
        document.getElementById('saveWorkout').addEventListener('click', () => {
            this.saveWorkout();
        });

        // Clear workout button
        document.getElementById('clearWorkout').addEventListener('click', () => {
            this.clearWorkout();
        });
    }

    addExercise() {
        const exercise = document.getElementById('exercise').value.trim();
        const sets = parseInt(document.getElementById('sets').value);
        const reps = parseInt(document.getElementById('reps').value);
        const weight = parseFloat(document.getElementById('weight').value) || 0;
        const category = document.getElementById('category').value;

        if (!exercise || sets <= 0 || reps <= 0) {
            alert('Please fill in all required fields with valid values.');
            return;
        }

        const exerciseData = {
            id: Date.now(),
            exercise,
            sets,
            reps,
            weight,
            category,
            timestamp: new Date().toLocaleTimeString(),
            volume: sets * reps * weight
        };

        this.currentWorkout.push(exerciseData);
        this.renderCurrentWorkout();
        this.updateWorkoutSummary();
        this.resetForm();
    }

    renderCurrentWorkout() {
        const container = document.getElementById('workoutItems');
        container.innerHTML = '';

        if (this.currentWorkout.length === 0) {
            container.innerHTML = '<div class="empty-state">No exercises added yet. Start by adding some exercises!</div>';
            return;
        }

        this.currentWorkout.forEach(item => {
            const exerciseElement = document.createElement('div');
            exerciseElement.className = `workout-item category-${item.category}`;
            exerciseElement.innerHTML = `
                <div class="exercise-info">
                    <div class="exercise-name">${item.exercise}</div>
                    <div class="exercise-details">
                        ${item.sets} sets × ${item.reps} reps
                        ${item.weight > 0 ? `× ${item.weight}kg` : ''}
                        ${item.weight > 0 ? `(Volume: ${item.volume}kg)` : ''}
                        <span style="margin-left: 10px; color: #666; font-size: 0.8em;">${item.timestamp}</span>
                    </div>
                </div>
                <button class="delete-btn" onclick="app.removeExercise(${item.id})">×</button>
            `;
            container.appendChild(exerciseElement);
        });
    }

    removeExercise(id) {
        this.currentWorkout = this.currentWorkout.filter(item => item.id !== id);
        this.renderCurrentWorkout();
        this.updateWorkoutSummary();
    }

    updateWorkoutSummary() {
        const totalExercises = this.currentWorkout.length;
        const totalSets = this.currentWorkout.reduce((sum, item) => sum + item.sets, 0);
        const totalVolume = this.currentWorkout.reduce((sum, item) => sum + item.volume, 0);

        document.getElementById('totalExercises').textContent = totalExercises;
        document.getElementById('totalSets').textContent = totalSets;
        document.getElementById('totalVolume').textContent = totalVolume.toFixed(1);
    }

    resetForm() {
        document.getElementById('workoutForm').reset();
        document.getElementById('exercise').focus();
    }

    saveWorkout() {
        if (this.currentWorkout.length === 0) {
            alert('No exercises to save. Please add some exercises first.');
            return;
        }

        const workoutData = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            exercises: [...this.currentWorkout],
            totalExercises: this.currentWorkout.length,
            totalSets: this.currentWorkout.reduce((sum, item) => sum + item.sets, 0),
            totalVolume: this.currentWorkout.reduce((sum, item) => sum + item.volume, 0)
        };

        this.workoutHistory.unshift(workoutData);
        this.saveHistory();
        this.renderWorkoutHistory();
        this.clearWorkout();

        alert('Workout saved successfully! 🎉');
    }

    clearWorkout() {
        if (confirm('Are you sure you want to clear all exercises?')) {
            this.currentWorkout = [];
            this.renderCurrentWorkout();
            this.updateWorkoutSummary();
        }
    }

    renderWorkoutHistory() {
        const container = document.getElementById('historyList');
        container.innerHTML = '';

        if (this.workoutHistory.length === 0) {
            container.innerHTML = '<div class="empty-state">No workout history yet. Save your first workout to see it here!</div>';
            return;
        }

        this.workoutHistory.forEach(workout => {
            const historyElement = document.createElement('div');
            historyElement.className = 'history-item';
            
            const exerciseList = workout.exercises.map(ex => 
                `${ex.exercise} (${ex.sets}×${ex.reps}${ex.weight > 0 ? `×${ex.weight}kg` : ''})`
            ).join(', ');

            historyElement.innerHTML = `
                <div class="history-date">
                    ${workout.date} at ${workout.time}
                    <span style="float: right; font-size: 0.8em; color: #666;">
                        ${workout.totalExercises} exercises, ${workout.totalSets} sets
                    </span>
                </div>
                <div class="history-exercises">
                    ${exerciseList}
                </div>
                <div style="margin-top: 5px; font-size: 0.9em; color: #667eea;">
                    Total Volume: ${workout.totalVolume.toFixed(1)}kg
                </div>
            `;
            container.appendChild(historyElement);
        });
    }

    saveHistory() {
        localStorage.setItem('gymWorkoutHistory', JSON.stringify(this.workoutHistory));
    }

    loadHistory() {
        const saved = localStorage.getItem('gymWorkoutHistory');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app
const app = new GymRoutineApp();

// Add some sample data for demonstration
if (app.workoutHistory.length === 0) {
    const sampleWorkout = {
        id: Date.now() - 86400000, // Yesterday
        date: new Date(Date.now() - 86400000).toLocaleDateString(),
        time: '18:30:00',
        exercises: [
            {
                id: 1,
                exercise: 'Bench Press',
                sets: 4,
                reps: 8,
                weight: 60,
                category: 'chest',
                timestamp: '18:30:00',
                volume: 1920
            },
            {
                id: 2,
                exercise: 'Squats',
                sets: 5,
                reps: 5,
                weight: 80,
                category: 'legs',
                timestamp: '18:45:00',
                volume: 2000
            }
        ],
        totalExercises: 2,
        totalSets: 9,
        totalVolume: 3920
    };
    app.workoutHistory.push(sampleWorkout);
    app.saveHistory();
    app.renderWorkoutHistory();
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        document.getElementById('workoutForm').dispatchEvent(new Event('submit'));
    }
    if (e.key === 'Escape') {
        app.resetForm();
    }
});

// Add some helpful tips
console.log('💪 Gym Routine App Tips:');
console.log('• Use Ctrl+Enter to quickly add exercises');
console.log('• Press Escape to clear the form');
console.log('• Your data is saved automatically in your browser');
