
export async function load({fetch}) {
	const exercisesResponse = await fetch('/api/exercises')
	const exercises = await exercisesResponse.json()
	
	const bodyPartsResponse = await fetch('/api/body-parts')
	const bodyParts = await bodyPartsResponse.json()
	return { exercises, bodyParts };
}
