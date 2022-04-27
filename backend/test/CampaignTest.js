import prisma from "@prisma/client";
import faker from "@faker-js/faker";

const campaign = new prisma.PrismaClient().campaign
process.env.QUERY_BATCH_SIZE = 100000

async function insert_campaign(size) {

    console.log(`Total Size : ${size}`)
    const campaignCategoryId = 3
    const userId = 2

    let campaigns = []

    for (let i = 0; i < size; i++) {

        let obj = {
            userId,
            campaignCategoryId,
            name: faker.company.companyName(),
            shortDesc: faker.lorem.lines(1),
            description: faker.lorem.lines(20),
            startDate: new Date(),
            image: faker.image.imageUrl(),
            endDate: new Date(),
        }

        campaigns.push(obj)
    }


    await campaign.createMany({
        data: campaigns, skipDuplicates: true
    })

}


insert_campaign(process.argv[2]).then(r => console.log(r) )

async function deleteMany() {
    await campaign.deleteMany({})
}

//(async () => await deleteMany())()