import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    GridLegacy as Grid,
    Typography,
    Box
} from '@mui/material';
import { calculateScore } from '../../services/scoringService';
import type { SellerScore } from '../../types';
import type { QuestionnaireAnswers } from '../../services/scoringService';

interface Props {
    open: boolean;
    onClose: () => void;
    onSave: (score: SellerScore) => void;
}

const ScoringForm = ({ open, onClose, onSave }: Props) => {
    const [answers, setAnswers] = useState<QuestionnaireAnswers>({
        timeframe: '3_MONTHS',
        motivation: 'WANT_SELL',
        priceExpectation: 'MARKET',
        exclusivity: 'MAYBE',
    });

    const [result, setResult] = useState<SellerScore | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
        setResult(null); // Reset result on change
    };

    const handleCalculate = () => {
        const score = calculateScore(answers);
        setResult(score);
    };

    const handleConfirm = () => {
        if (result) {
            onSave(result);
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Seller Scoring Qualification</DialogTitle>
            <DialogContent>
                <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>When do they need to sell?</FormLabel>
                            <RadioGroup name="timeframe" value={answers.timeframe} onChange={handleChange}>
                                <FormControlLabel value="IMMEDIATE" control={<Radio />} label="Immediately (< 1 month)" />
                                <FormControlLabel value="3_MONTHS" control={<Radio />} label="Within 3 months" />
                                <FormControlLabel value="6_MONTHS" control={<Radio />} label="Within 6 months" />
                                <FormControlLabel value="UNCERTAIN" control={<Radio />} label="Uncertain / In a year" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Reason for selling?</FormLabel>
                            <RadioGroup name="motivation" value={answers.motivation} onChange={handleChange}>
                                <FormControlLabel value="MUST_SELL" control={<Radio />} label="Must sell (Divorce, Transfer, Debt)" />
                                <FormControlLabel value="WANT_SELL" control={<Radio />} label="Wants to move (Upgrade, Downsize)" />
                                <FormControlLabel value="curious" control={<Radio />} label="Curious / Testing market" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Price Expectation</FormLabel>
                            <RadioGroup name="priceExpectation" value={answers.priceExpectation} onChange={handleChange}>
                                <FormControlLabel value="MARKET" control={<Radio />} label="Realistic / Market Price" />
                                <FormControlLabel value="ABOVE_MARKET" control={<Radio />} label="Slightly Ambitious" />
                                <FormControlLabel value="UNREALISTIC" control={<Radio />} label="Above Market / Unrealistic" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl>
                            <FormLabel>Exclusivity Potential</FormLabel>
                            <RadioGroup name="exclusivity" value={answers.exclusivity} onChange={handleChange}>
                                <FormControlLabel value="YES" control={<Radio />} label="Open to Exclusive Mandate" />
                                <FormControlLabel value="MAYBE" control={<Radio />} label="Maybe / Discussable" />
                                <FormControlLabel value="NO" control={<Radio />} label="Refuses Exclusive" />
                            </RadioGroup>
                        </FormControl>
                    </Grid>

                    {result && (
                        <Grid item xs={12}>
                            <Box sx={{ p: 2, bgcolor: result.classification === 'CHAUD' ? '#e8f5e9' : result.classification === 'FROID' ? '#ffebee' : '#fff3e0', borderRadius: 1, textAlign: 'center' }}>
                                <Typography variant="h5" color="text.primary">
                                    Score: {result.totalScore}/100
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                    {result.classification}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                {!result ? (
                    <Button onClick={handleCalculate} variant="contained">Calculate</Button>
                ) : (
                    <Button onClick={handleConfirm} variant="contained" color="success">
                        Confirm Classification
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ScoringForm;
