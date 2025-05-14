<script lang="ts">
    type BodyPartCardProp = {
		name: string
	}

    let { name }: BodyPartCardProp = $props()
</script>

<div class="body-part-card">
	<h3 class="body-part-card__name">{name}</h3>
</div>

<style>
.body-part-card {
	padding: 1rem;
	border-radius: 0.8rem;
	background: #f5f5f5;
	text-align: center;
	box-shadow: 0 0.2rem 0.6rem rgba(0, 0, 0, 0.1);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.body-part-card:hover {
	transform: translateY(-0.3rem);
	box-shadow: 0 0.6rem 1.2rem rgba(0, 0, 0, 0.15);
}

.body-part-card__name {
	font-size: 1.4rem;
	color: #333333;
}
</style>
