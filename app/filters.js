const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const marked = require('marked')
const numeral = require('numeral')

const courseHelper = require('./helpers/courses')
const cycleHelper = require('./helpers/cycles')
const locationHelper = require('./helpers/locations')
const notificationHelper = require('./helpers/notifications')
const organisationHelper = require('./helpers/organisations')
const permissionHelper = require('./helpers/permissions')
const subjectHelper = require('./helpers/subjects')
const visaSponsorshipHelper = require('./helpers/visa-sponsorship')

const individualFiltersFolder = path.join(__dirname, './filters')

module.exports = (env) => {
  /**
   * Instantiate object used to store the methods registered as a
   * 'filter' (of the same name) within nunjucks. You can override
   * gov.uk core filters by creating filter methods of the same name.
   * @type {Object}
   */
  const filters = {}

  // Import filters from filters folder
  if (fs.existsSync(individualFiltersFolder)) {
    const files = fs.readdirSync(individualFiltersFolder)
    files.forEach(file => {
      const fileData = require(path.join(individualFiltersFolder, file))
      // Loop through each exported function in file (likely just one)
      Object.keys(fileData).forEach((filterGroup) => {
        // Get each method from the file
        Object.keys(fileData[filterGroup]).forEach(filterName => {
          filters[filterName] = fileData[filterGroup][filterName]
        })
      })
    })
  }

  filters.includes = (route, string) => {
    if (route && route.includes(string)) {
      return true
    } else {
      return false
    }
  }

  /* ------------------------------------------------------------------
  utility function to return true or false
  example: {{ 'yes' | falsify }}
  outputs: true
  ------------------------------------------------------------------ */
  filters.falsify = (input) => {
    if (_.isNumber(input)) return input
    else if (input == false) return false
    if (_.isString(input)) {
      const truthyValues = ['yes', 'true']
      const falsyValues = ['no', 'false']
      if (truthyValues.includes(input.toLowerCase())) return true
      else if (falsyValues.includes(input.toLowerCase())) return false
    }
    return input
  }

  /* ------------------------------------------------------------------
   numeral filter for use in Nunjucks
   example: {{ params.number | numeral("0,00.0") }}
   outputs: 1,000.00
  ------------------------------------------------------------------ */
  filters.numeral = (number, format) => {
    return numeral(number).format(format)
  }

  /* ------------------------------------------------------------------
  utility function to get an error for a component
  example: {{ errors | getErrorMessage('title') }}
  outputs: "Enter a title"
  ------------------------------------------------------------------ */
  filters.getErrorMessage = function (array, fieldName) {
    if (!array || !fieldName) {
      return null
    }

    const error = array.filter((obj) =>
      obj.fieldName === fieldName
    )[0]

    return error
  }

  /* ------------------------------------------------------------------
  utility function to get the subject level label
  example: {{ 'further_education' | getSubjectLevelLabel }}
  outputs: "Further education"
  ------------------------------------------------------------------ */
  filters.getSubjectLevelLabel = (subjectLevel) => {
    let label = subjectLevel

    if (subjectLevel) {
      label = subjectHelper.getSubjectLevelLabel(subjectLevel)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the subject label
  example: {{ 'W1' | getSubjectLabel }}
  outputs: "Art and design"
  ------------------------------------------------------------------ */
  filters.getSubjectLabel = (subject) => {
    let label = subject

    if (subject) {
      label = subjectHelper.getSubjectLabel(subject)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the SEND label
  example: {{ 'yes' | getSendLabel }}
  outputs: "Yes"
  ------------------------------------------------------------------ */
  filters.getSendLabel = (send) => {
    let label
    if (send) {
      label = courseHelper.getSendLabel(send)
    }
    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the age range label
  example: {{ '5_to_11' | getAgeRangeLabel }}
  outputs: "5 to 11"
  ------------------------------------------------------------------ */
  filters.getAgeRangeLabel = (ageRange) => {
    let label = ageRange

    if (ageRange) {
      label = courseHelper.getAgeRangeLabel(ageRange)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the funding type label
  example: {{ 'fee' | getFundingTypeLabel }}
  outputs: "Fee paying (no salary)"
  ------------------------------------------------------------------ */
  filters.getFundingTypeLabel = (fundingType) => {
    let label = fundingType

    if (fundingType) {
      label = courseHelper.getFundingTypeLabel(fundingType)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the apprenticeship label (based on funding type)
  example: {{ 'fee' | getApprenticeshipLabel }}
  outputs: "No"
  ------------------------------------------------------------------ */
  filters.getApprenticeshipLabel = (fundingType) => {
    let label = fundingType

    if (fundingType) {
      label = courseHelper.getApprenticeshipLabel(fundingType)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the study mode label
  example: {{ 'both' | getStudyModeLabel }}
  outputs: "Full time or part time"
  ------------------------------------------------------------------ */
  filters.getStudyModeLabel = (studyMode) => {
    let label = studyMode

    if (studyMode) {
      label = courseHelper.getStudyModeLabel(studyMode)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the qualification label
  example: {{ 'pgce_with_qts' | getQualificationLabel }}
  outputs: "PGCE with QTS"
  ------------------------------------------------------------------ */
  filters.getQualificationLabel = (qualification) => {
    let label = qualification

    if (qualification) {
      label = courseHelper.getQualificationLabel(qualification)
    }

    return label
  }

  // TODO: qualification description

  /* ------------------------------------------------------------------
  utility function to get the location label
  example: {{ '92a06b2e-638e-4dc8-b43f-bbbbf046eca2'
              | getLocationLabel(d8370001-6f2b-4624-b30c-27ddc5beebfc) }}
  outputs: "Main site"
  ------------------------------------------------------------------ */
  filters.getLocationLabel = (location, organisation) => {
    let label = location

    if (location && organisation) {
      label = locationHelper.getLocationLabel(location, organisation)
    }

    return label
  }

  // TODO: location description

  /* ------------------------------------------------------------------
  utility function to get the cycle label
  example: {{ '2022' | getCycleLabel }}
  outputs: "2021 to 2022 - current"
  ------------------------------------------------------------------ */
  filters.getCycleLabel = (cycle) => {
    let label = cycle

    if (cycle) {
      label = cycleHelper.getCycleLabel(cycle)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the organisation label
  example: {{ '2022' | getOrganisationLabel }}
  outputs: "2021 to 2022 - current"
  ------------------------------------------------------------------ */
  filters.getOrganisationLabel = (organisation) => {
    let label = organisation

    if (organisation) {
      label = organisationHelper.getOrganisationLabel(organisation)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course length label
  example: {{ 'OneYear' | getCourseLengthLabel }}
  outputs: "One year"
  ------------------------------------------------------------------ */
  filters.getCourseLengthLabel = (length) => {
    let label = length

    if (length) {
      label = courseHelper.getCourseLengthLabel(length)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course status label
  example: {{ "1" | getCourseStatusLabel }}
  outputs: "Published"
  ------------------------------------------------------------------ */
  filters.getCourseStatusLabel = (status) => {
    let label = status

    if (status !== undefined) {
      label = courseHelper.getCourseStatusLabel(status.toString())
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the course status colour
  example: {{ "1" | getCourseStatusColour }}
  outputs: "govuk-tag--green"
  ------------------------------------------------------------------ */
  filters.getCourseStatusClasses = (status) => {
    let label

    if (status !== undefined) {
      label = courseHelper.getCourseStatusClasses(status.toString())
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the student visa label
  example: {{ "yes" | getStudentVisaLabel }}
  outputs: "Yes"
  ------------------------------------------------------------------ */
  filters.getStudentVisaLabel = (code) => {
    let label

    if (code) {
      label = visaSponsorshipHelper.getStudentVisaLabel(code)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the skilled worker visa label
  example: {{ "no" | getStudentVisaLabel }}
  outputs: "No, or not applicable"
  ------------------------------------------------------------------ */
  filters.getSkilledWorkerVisaLabel = (code) => {
    let label

    if (code) {
      label = visaSponsorshipHelper.getSkilledWorkerVisaLabel(code)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to parse markdown as HTML
  example: {{ "## Title" | markdownToHtml }}
  outputs: "<h2>Title</h2>"
  ------------------------------------------------------------------ */
  filters.markdownToHtml = (markdown) => {
    if (!markdown) {
      return null
    }
    const html = marked.parse(markdown)
    return html
  }

  /* ------------------------------------------------------------------
  utility function to get the notification label
  example: {{ "course_changed" | getNotificationLabel }}
  outputs: "Course is changed"
  ------------------------------------------------------------------ */
  filters.getNotificationLabel = (code) => {
    let label

    if (code) {
      label = notificationHelper.getNotificationLabel(code)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the permission label
  example: {{ "change_courses" | getPermissionLabel }}
  outputs: "Change courses"
  ------------------------------------------------------------------ */
  filters.getPermissionLabel = (code) => {
    let label

    if (code) {
      label = permissionHelper.getPermissionLabel(code)
    }

    return label
  }

  /* ------------------------------------------------------------------
  utility function to get the remainder when one operand is divided by
  a second operand
  example: {{ 4 | remainder(2) }}
  outputs: 0
  ------------------------------------------------------------------ */
  filters.remainder = (dividend, divisor) => {
    return dividend % divisor
  }

  /* ------------------------------------------------------------------
    keep the following line to return your filters to the app
  ------------------------------------------------------------------ */
  return filters
}
