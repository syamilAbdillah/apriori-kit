import * as nodeApriori from 'node-apriori'

function compactFloatDevider(num, devider) {
	return Math.round((num * 100) / devider) / 100
}

export default (itemsetList, minSupport) => new Promise((resolve, reject) => {
	const apriori = new nodeApriori.Apriori(minSupport / 100)
	const iterations = []

	apriori.on('data', ({items, support: frequent}) => {
		const support = compactFloatDevider(frequent * 100, itemsetList.length) // in percent
		console.log(`${support} = ${frequent} / ${itemsetList.length} * 100`)

		if(support < minSupport) return;
		items.sort()
		const itemset = items.join(',')
		const nIteration = items.length - 1

		if(iterations[nIteration]) {
			const iteration = iterations[nIteration]
			iteration.push({support, itemset, frequent})
			iterations[nIteration] = iteration
		} else {
			const iteration = [{support, itemset, frequent}]
			iterations[nIteration] = iteration
		}
	})

	apriori
		.exec(itemsetList)
		.then((result) => {
			resolve({iterations})
		})
})

