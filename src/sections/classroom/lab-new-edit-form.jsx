import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useParams, useRouter } from 'next/navigation';

import { LoadingButton } from '@mui/lab';
import {
  Grid,
  Card,
  Step,
  Fade,
  Stack,
  Button,
  Divider,
  Stepper,
  StepLabel,
  CardHeader,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import {
  createTestCase,
  createLaboratory,
  updateLaboratory,
  deleteAllTestCases,
} from 'src/utils/axios';

import { useGetTestCasesByLaboratoryId } from 'src/api/useTestCases';

import Markdown from 'src/components/markdown';
import TextMaxLine from 'src/components/text-max-line';
import FormProvider from 'src/components/hook-form/form-provider';

import LabProblemForm from './lab-problem-form';
import LabSummaryForm from './lab-summary-form';
import LabTestCaseForm from './lab-testcase-form';

// ----------------------------------------------------------------------

const steps = ['Lab Info', 'Test Case', 'Summary'];

// ----------------------------------------------------------------------

const stripHtmlTags = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const labInfoSchema = Yup.object().shape({
  labTitle: Yup.string()
    .required('Lab Title is required')
    .max(80, 'Lab title must not exceed 80 characters'),
  description: Yup.string().max(200, 'Lab description must not exceed 200 characters'),
  problemStatement: Yup.string()
    .required('Problem Statement is required')
    .test('max', 'Lab Problem Statement must not exceed 2500 characters', (value) => {
      const cleanedText = stripHtmlTags(value);
      return cleanedText.length <= 2500;
    }),
});

const testCaseSchema = Yup.object().shape({
  testCases: Yup.array().of(
    Yup.object().shape({
      input: Yup.string().required('Input is required'),
      expectedOutput: Yup.string().required('Expected Output is required'),
    })
  ),
});

const getValidationSchema = (step) => {
  switch (step) {
    case 0:
      return labInfoSchema;
    case 1:
      return testCaseSchema;
    default:
      return labInfoSchema;
  }
};

export default function LabNewEditForm({ currentLab }) {
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);

  const { testCases, isTestCaseLoading, isTestCaseError } = useGetTestCasesByLaboratoryId(
    params.lid
  );

  const defaultValues = useMemo(
    () => ({
      labTitle: currentLab?.labTitle || '',
      description: currentLab?.description || '',
      problemStatement: currentLab?.problemStatement || '',
      testCases:
        testCases.length > 0
          ? testCases.map((testCase) => ({
              input: testCase.input || '',
              expectedOutput: testCase.expectedOutput || '',
            }))
          : [{ input: '', expectedOutput: '' }],
    }),
    [currentLab, testCases]
  );

  const methods = useForm({
    resolver: yupResolver(getValidationSchema(activeStep)),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    formState: { isSubmitting },
    trigger,
  } = methods;

  useEffect(() => {
    if (currentLab) {
      reset({
        labTitle: currentLab.labTitle,
        description: currentLab.description,
        problemStatement: currentLab.problemStatement,
        testCases: testCases.map((testCase) => ({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput,
        })),
      });
    }
  }, [currentLab, testCases, reset]);

  const watchedLabTitle = watch('labTitle');
  const watchedProblemStatement = watch('problemStatement');

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (currentLab) {
        await updateLaboratory(params.lid, data);
        await deleteAllTestCases(params.lid);
        // eslint-disable-next-line no-restricted-syntax
        for (const testCase of data.testCases) {
          // eslint-disable-next-line no-await-in-loop
          await createTestCase(params.lid, testCase);
        }
        enqueueSnackbar('Update success!');
      } else {
        const response = await createLaboratory(params.aid, data);
        enqueueSnackbar('Create success!');
        // eslint-disable-next-line no-restricted-syntax
        for (const testCase of data.testCases) {
          // eslint-disable-next-line no-await-in-loop
          await createTestCase(response?.data?.laboratoryId, testCase);
        }
      }

      reset();
      router.push(paths.classroom.assignmentId(params.cid, params.aid));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  });

  const handleNext = async () => {
    const isStepValid = await trigger();
    console.log('Form values:', methods.getValues());
    console.log('Validation result:', isStepValid);
    if (isStepValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      console.log('Validation errors:', methods.formState.errors);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (isTestCaseLoading) return <div>Loading...</div>;
  if (isTestCaseError) return <div>Error loading test cases</div>;

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stepper
        activeStep={activeStep}
        alternativeLabel
        sx={{
          mb: 3,
        }}
      >
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>
                <TextMaxLine line={1}>{label}</TextMaxLine>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === steps.length - 1 ? (
        <Grid container>
          <Grid item xs={12}>
            <Fade in={activeStep === 2}>
              <div style={{ display: activeStep === 2 ? 'block' : 'none' }}>
                <LabSummaryForm
                  title={watchedLabTitle}
                  problemStatement={watchedProblemStatement}
                  testCases={testCases}
                  setActiveStep={setActiveStep}
                />
              </div>
            </Fade>

            <Stack spacing={1} direction="row" sx={{ my: 3 }}>
              <Button size="large" color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <LoadingButton
                type="submit"
                variant="contained"
                size="large"
                color="primary"
                loading={isSubmitting}
              >
                {!currentLab ? 'Create Lab' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      ) : (
        <Grid container>
          <Grid item xs={12} md={6}>
            {/* Conditional rendering based on activeStep */}
            <Fade in={activeStep === 0}>
              <div style={{ display: activeStep === 0 ? 'block' : 'none' }}>
                <LabProblemForm />
              </div>
            </Fade>
            <Fade in={activeStep === 1}>
              <div style={{ display: activeStep === 1 ? 'block' : 'none' }}>
                <LabTestCaseForm />
              </div>
            </Fade>

            <Stack spacing={1} direction="row" sx={{ my: 3 }}>
              {activeStep === 0 ? (
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  href={paths.classroom.assignmentId(params.cid, params.aid)}
                >
                  Cancel
                </Button>
              ) : (
                <Button size="large" color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                  Back
                </Button>
              )}
              <Button size="large" variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Stack>
          </Grid>
          <Grid item>
            <Divider orientation="vertical" sx={{ borderStyle: 'dashed', mx: 2 }} />
          </Grid>
          <Grid item xs={12} md={5}>
            <Card>
              <CardHeader title={watchedLabTitle || 'Type Header'} />
              <Stack spacing={3} sx={{ p: 3 }}>
                <Markdown children={watchedProblemStatement || '<p>Problem Statement</p>'} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      )}
    </FormProvider>
  );
}

LabNewEditForm.propTypes = {
  currentLab: PropTypes.object,
};
