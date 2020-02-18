# Publish teacher training courses<br />Prototype and design history

The course management tool for https://find-postgraduate-teacher-training.education.gov.uk/

Prototype:<br /> https://manage-courses-prototype.herokuapp.com/

Design history:<br />
https://bat-design-history.netlify.com/publish-teacher-training-courses/

## Find postgraduate teacher training courses service

The live service lives at:<br />
* http://find-postgraduate-teacher-training.education.gov.uk/
* https://github.com/DFE-Digital/search-and-compare-ui

Design history of the frontend at:<br />
* https://bat-design-history.netlify.com/find-teacher-training/

## Change the provider in the prototype

* Copy `courses-clean.json` from [courses-clean.zip](https://github.com/DFE-Digital/search-and-compare-data/blob/master/courses-clean.zip) in the search-and-compare-data repo to this repo (it’s in .gitignore already)
* Set the `provider` in [generate.rb](https://github.com/fofr/manage-courses-prototype/blob/master/generate.rb#L9) to the name of the provider in UCAS
* Run the ruby script: `./generate.rb`, which generates a new `prototype_data.json` file
* Commit the changes to master, which auto-deploys to Heroku

## Upgrade the prototype kit

Based on https://govuk-prototype-kit.herokuapp.com/docs/updating-the-kit

Add upstream to remotes:

```bash
git remote add upstream https://github.com/alphagov/govuk-prototype-kit.git
```

Merge upstream to a new branch:

```bash
git checkout -b upgrade-kit
git fetch upstream latest-release
git checkout upgrade-kit && git merge FETCH_HEAD --allow-unrelated-histories
```

You’ll get a few merge conflicts where both apps are trying to add the same files.

When merging the upgrade, do a squash and merge to avoid adding 1500 new commits to the timeline.
