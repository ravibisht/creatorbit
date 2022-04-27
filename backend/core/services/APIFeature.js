export default class APIFeature {

    queryBuilder = {}

    constructor(queryString) {
        this.query = queryString

    }

    paginate() {
        if (this.query.pageNo) {
            this.queryBuilder['take'] = Number(this.query.pageNo) || 1
            const limit = Number(this.query.pageSize) || 10
            this.queryBuilder['skip'] = limit * (this.query.pageNo - 1)
        }
        return this
    }

    build() {
        return this.queryBuilder
    }
}
