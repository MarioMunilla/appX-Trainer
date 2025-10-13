export interface ExerciseRow {
    id: string
    name: string
    description?: string
    gif_url: string
    body_part_id: string
    difficulty: 'beginner' | 'intermediate' | 'advanced' | string
    created_at?: string
    updated_at?: string
    [column: string]: unknown
}

/** Resultado de GET /api/exercises  */
export interface ExercisesResponse {
    info: {
        count: number | null
        pages: number
        prev: number | null
        next: number | null
    }
    results: (ExerciseRow & { isFavorite?: boolean })[]
}

/** Resultado de GET /api/exercises/[slug] */
export interface ExerciseDetailResponse extends ExerciseRow {
    userScore: number | null
}

/** Resultado de POST /api/exercises/[slug] */
export interface ExerciseRatingResponse {
    exercise: ExerciseDetailResponse
}

/** POST /api/exercises */
export interface ToggleFavoriteBody {
    exercise_id: string
    favorite: boolean
}

export interface BodyPart {
    id: string
    name: string
    group: string
    description?: string
    [column: string]: unknown
}

export type BodyPartsResponse = BodyPart[]

export interface RoutineExercise {
    exercise_id: string
    repetitions: number
    order: number
    weight?: number
    exercises?: ExerciseRow
}

export interface RoutinesExercisesRow {
    routine_id: string
    exercise_id: string
    repetitions: number
    order: number
    weight?: number | null
}

/** GET /api/routines  (rutina actual del usuario) */
export type RoutineGetResponse
    = | {
        routine_id: null
        name: null
        description: null
        exercises: []
    }
    | {
        routine_id: string
        name: string
        description: string
        exercises: RoutineExercise[]
    }

/** POST /api/routines  (añadir ejercicio a la rutina) */
export interface RoutineAddExerciseResponse {
    success: true
    routine_id: string
}

/** PATCH /api/routines/[routine_id]/[exercise_id]  (actualizar ejercicio en rutina) */
export interface RoutineExerciseUpdateBody {
    weight?: number
    repetitions?: number
    order?: number
}

/** PATCH /api/routines/[routine_id]/[exercise_id]  (respuesta de actualización) */
export interface RoutineExerciseUpdateResponse {
    success: true
    data: RoutinesExercisesRow
}
/** GET /api/routines/[slug]  (detalle rutina ajena o propia) */
export interface RoutineDetailResponse {
    id: string
    user_id: string
    name: string
    description: string
    difficulty?: string
    created_at?: string
    exercises: RoutineExercise[]
    [column: string]: unknown
}

export type JsonResponse<T> = T
