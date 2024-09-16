const { Job } = require("../models/JobModel");

exports.getAllJob = async (req, res) => {

    try {

        console.log(req.query);
        console.log((req.query.experience));
        const page = (req.params["page"]);

        let query = Job.find();
        let totalQuery = Job.find();

        const queryLength = Object.keys(req.query).length

        if (queryLength > 0) {

            let queryArr = [];

            for (let key in req.query) {


                if (key == "experience") {
                    queryArr.push({ experience: { $in: JSON.parse(req.query.experience) } })
                }

                if (key == "type") {
                    queryArr.push({ type: { $in: JSON.parse(req.query.type) } })
                }

                if (key == "date") {
                    queryArr.push({ postedOn: { '$gte': new Date(Date.now() - req.query.date * 24 * 60 * 60 * 1000) } })
                }

                if (key == "salaryFrom") {
                    queryArr.push({ fixedSalary: { "$gte": Number(req.query.salaryFrom), "$lte": Number(req.query.salaryTo) } })
                }

                if (key == "country") {
                    queryArr.push({ country: { $regex: '^' + req.query.country, $options: 'i' } })
                }

                if (key == "search") {
                    queryArr.push({ "title": { $regex: '^' + req.query.search, $options: 'i' } })
                }

            }

            console.log(queryArr);

            query = query.find({ $and: queryArr });
            totalQuery = totalQuery.find({ $and: queryArr });


        } else {

            query = query.find();
            totalQuery = totalQuery.find();

        }

        let totalDocs = await totalQuery.countDocuments()
        console.log(totalDocs);

        query = await query.skip(10 * page).limit(10);

        res.set('X-Total-Count', totalDocs);
        res.status(200).json(query);

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Getting All Jobs' });
    }
}

exports.getJob = async (req, res) => {
    try {
        const { jobId, postedBy, jobIdArr } = req.query;

        if (jobIdArr) {

            console.log(jobIdArr);

            let jobIdArr1 = JSON.parse(jobIdArr)

            let jobsArr = await Promise.all(jobIdArr1.map(async (e) => (await Job.findById(e))))

            res.status(200).send(jobsArr)

        } else if (jobId) {
            // helps in getting job details
            const docs = await Job.findById(jobId);
            res.status(200).json(docs);
        } else if (postedBy) {
            // helps in getting job posted by employer
            console.log("GETTING JOB POSTEX BY EMPLOYER");
            const docs = await Job.find({ postedBy: postedBy });
            res.status(200).json(docs);
        } else {
            res.status(400).json("CAN'T GET QUERY FOR JOB");
        }

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Getting Job By Id' });
    }
}

exports.addJob = async (req, res) => {
    try {

        console.log(req.body);

        const job = new Job(req.body)
        let newUser = await job.save();
        res.status(200).json(newUser);

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Making New Job', "error": error });
    }
}

exports.updateJob = async (req, res) => {
    try {

        const { jobId } = req.query;
        const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, { new: true })
        res.status(200).json(updatedJob);

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Updating Job' });
    }
}

exports.deleteJob = async (req, res) => {
    try {

        const { jobId } = req.query;
        const updateUser = await Job.findByIdAndDelete(jobId)
        res.status(200).json(updateUser);

    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Deleting Job' });
    }
}

exports.getCountries = async (req, res) => {
    try {

        const countriesArr = await Job.find().select("country")

        res.status(200).json(countriesArr)


    } catch (error) {
        console.log(error);
        res.status(400).json({ 'message': 'Error In Getting All Countries' });
    }
}



