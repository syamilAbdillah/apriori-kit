import * as nodeApriori from 'node-apriori'

function compactFloatDevider(num, devider) {
	return Math.round((num * 100) / devider) / 100
}

export default (itemsetList, minSupport, minConfidence) => new Promise((resolve, reject) => {
	const apriori = new nodeApriori.Apriori(minSupport / 100)
	const iterations = []
	const kv = new Map()

	apriori.on('data', ({items, support: frequent}) => {
		const support = compactFloatDevider(frequent * 100, itemsetList.length) // in percent
		// console.log(`${support} = ${frequent} / ${itemsetList.length} * 100`)

		if(support < minSupport) return;
		if(minSupport == 0) return;
		
		items.sort()
		const itemset = items.join(',')
		const nIteration = items.length - 1

		// memoizaion to kv store
		kv.set(itemset, support)

		// append to iteraitons
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
			const rules = {}
			// iterate over last iterations item
			const lastIteration = iterations[iterations.length - 1]
			lastIteration.forEach(({support, itemset, frequent}) => {
				if(iterations.length < 2) return;
				const rule = []
				
				const set = itemset.split(',')
				unfilter_rules(set, ([left, right]) => {
					const x = left.join(',')
					const y = right.join(',')
					const supportX = kv.get(x)
					const confidence = compactFloatDevider((support * 100),(supportX))

					if(confidence < minConfidence) return;

					rule.push({
						x,
						y,
						supportX,
						confidence,
						supportXUY: support,
					})
				})

				rules[itemset] = rule
			})

			resolve({iterations, rules})
		})
})

function k_combinations(set, k) {
  if (k > set.length || k <= 0) {                                               
    return []                                                                   
  }                                                                             
  if (k === set.length) {                                                       
    return [set]                                                    
  }                                                                             
  const combs = []                                                              
  if (k === 1) {                                                                
    for (let i = 0; i < set.length; i++) {                                      
      combs.push([set[i]])                                                      
    }                                                                           
    return combs                                                                
  }                                                                             
  for (let i = 0; i < set.length - k + 1; i++) {                                
    const head = set.slice(i, i + 1)                                            
    const tailcombs = k_combinations(set.slice(i + 1), k - 1)              
    for (let j = 0; j < tailcombs.length; j++) {                                
      combs.push(head.concat(tailcombs[j]).sort())                                     
    }                                                                           
  }                                                                             
  return combs                                                      
}                                                                               
                                                                                
const combinations = (set, cb) => {                                                 
  for (let k = 1; k <= set.length - 1; k++) {                                       
    const k_combs = k_combinations(set, k)                                      
    for (let i = 0; i < k_combs.length; i++) {                                  
      cb(k_combs[i], k)                                                    
    }                                                                           
  }    
}

const unfilter_rules = (itemset, cb) => {
	let set = new Set(itemset)

	combinations(itemset, comb => {
		for(let c of comb) {
			set.delete(c)
		}

		cb([comb, Array.from(set)])
		set = new Set(itemset)
	})
}

