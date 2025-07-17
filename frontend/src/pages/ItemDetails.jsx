import React, { useEffect, useState } from 'react';
import {Box,Typography,Container,Divider,Chip,Paper,Button,Dialog,DialogTitle,DialogContent,DialogActions} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import axios from '../api/axios';
import Loader from '../components/Loader';
import * as Yup from 'yup';
import MessageSnackbar from '../components/MessageSnackbar';

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [claims, setClaims] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openProofDialog, setOpenProofDialog] = useState(false);
  const [proofImage, setProofImage] = useState(null);
   const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('success');

  const fetchItem = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/items/${id}`);
      setItem(res.data);
    } catch {
      alert('Error loading item');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaims = async () => {
    try {
      const res = await axios.get(`/claims/${id}`);
      setClaims(res.data);
    } catch {
      setClaims([]);
    }
  };

  const decodeToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setCurrentUserId(payload.id);
    } catch {
      localStorage.removeItem('token');
    }
  };

  const handleApprove = async (claimId) => {
    try {
      await axios.post(`/claims/${claimId}/approve`);
      await fetchItem();
      await fetchClaims();
    } catch {
      alert('Failed to approve claim');
    }
  };

  const handleInitiateClaim = async (claimId) => {
    try {
      const formData = new FormData();
      formData.append('proofImage', claimFormik.values.proofImage);
      await axios.post(`/claims/${claimId}/initiate`, formData);
      claimFormik.setFieldValue('proofImage', null);
      setMessage('Claim initiated successfully!');
        setMessageType('success');
      await fetchClaims();
    } catch {
      setMessage('Failed to initiate claim');
        setMessageType('error');
    }
  };

  const approvedClaim = claims.find((c) => c.isApproved);
  const userClaim = claims.find((c) => c.claimedBy?._id === currentUserId);

  useEffect(() => {
    decodeToken();
    fetchItem();
    fetchClaims();
  }, [id]);

  const claimFormik = useFormik({
    initialValues: {
      proofImage: null,
    },
    validationSchema: Yup.object({
      proofImage: Yup.mixed().required('Image is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append('itemId', item._id);
        if (values.proofImage) {
          formData.append('proofImage', values.proofImage);
        }
        await axios.post('/claims', formData);
        resetForm();
        await fetchClaims();
      } catch {
        setMessage('Claim failed');
        setMessageType('error');
      }
    },
  });

  return (
    <Container maxWidth="md">
      {message && (
        <MessageSnackbar
          message={message}
          messageType={messageType}
          handleClose={()=>setMessage('')}
        />
      )}
      {loading || !item ? (
        <Loader />
      ) : (
        <Paper elevation={3} sx={{ p: 4, mt: 5, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {item.title}
          </Typography>

          {item.image && (
            <img
              src={`http://localhost:5000/uploads/${item.image}`}
              alt={item.title}
              style={{
                width: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: 12,
                marginBottom: '1.5rem',
              }}
            />
          )}

          <Typography variant="body1" gutterBottom>
            {item.description}
          </Typography>

          <Typography mb={1}>
            Location: <strong>{item.location}</strong>
          </Typography>

          <Typography mb={1}>
            Type: <Chip label={item.type.toUpperCase()} color="primary" size="small" />
          </Typography>

          <Typography>
            Posted by: <strong>{item.postedBy?.name}</strong>
          </Typography>

          {/* ✅ Claimed Notice */}
          {approvedClaim ? (
            <Box mt={4}>
              <Divider sx={{ mb: 2 }} />
              {item.type === 'found' ? (
                <>
                  <Typography variant="h6" color="success.main">
                    ✅ This item has been claimed
                    {approvedClaim.claimedBy?._id === currentUserId ? ' by you.' : ' with proof by someone.'}
                  </Typography>
                  {approvedClaim.claimedBy?._id === currentUserId && (
                    <Typography mt={1}>
                      Reach Out To: <strong>{item.postedBy?.phone}</strong>
                    </Typography>
                  )}
                </>
              ) : (
                <>
                  <Typography variant="h6" color="success.main">
                    ✅ This item has been claimed
                    {item.postedBy._id === currentUserId ? ' by you.' : ' with proof by someone.'}
                  </Typography>
                  {item.postedBy._id === currentUserId && (
                    <Typography mt={1}>
                      Reach Out To: <strong>{approvedClaim.claimedBy?.phone}</strong>
                    </Typography>
                  )}
                </>
              )
              }
            </Box>
          ) : item.type === 'found' ? (
            <Box mt={4}>
              {/* 🔹 FOUND FLOW */}
              {currentUserId && currentUserId !== item.postedBy?._id && !userClaim && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    Claim This Item
                  </Typography>
                  <Box
                    component="form"
                    onSubmit={claimFormik.handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ alignSelf: 'flex-start' }}
                    >
                      Upload Proof
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => claimFormik.setFieldValue('proofImage', e.target.files[0])}
                      />
                    </Button>

                    <Button type="submit" variant="contained" color="primary">
                      Submit Claim
                    </Button>
                  </Box>

                </>
              )}

              {userClaim && (
                <>
                  <Divider sx={{ my: 4 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Your Claim
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 1 }}>
                      Status:{' '}
                      <strong>
                        {userClaim.isApproved ? '✅ Approved' : '⏳ Pending'}
                      </strong>
                    </Typography>

                    {userClaim.isApproved && (
                      <Typography variant="body2" color="text.secondary">
                        Reach Out To:{' '}
                        <strong style={{ color: '#000' }}>{item.postedBy?.phone}</strong>
                      </Typography>
                    )}
                  </Box>
                </>

              )}

              {currentUserId === item.postedBy?._id && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6">Claims Received</Typography>
                  {claims.length === 0 ? (
                    <Typography>No claims yet.</Typography>
                  ) : (
                    claims.map((claim) => (
                      <Paper key={claim._id} sx={{ p: 2, mt: 2 }}>
                        <Typography>
                          👤 <strong>{claim.claimedBy?.name}</strong> ({claim.claimedBy?.email})
                        </Typography>
                        {claim.proofImage && (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 1, mr: 2 }}
                            onClick={() => {
                              setProofImage(claim.proofImage);
                              setOpenProofDialog(true);
                            }}
                          >
                            View Proof
                          </Button>
                        )}
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ mt: 1 }}
                          disabled={item.isClaimed || claim.isApproved}
                          onClick={() => handleApprove(claim._id)}
                        >
                          Approve
                        </Button>
                        <Typography mt={1}>
                          Status:{' '}
                          <strong>{claim.isApproved ? '✅ Approved' : '⏳ Pending'}</strong>
                        </Typography>
                      </Paper>
                    ))
                  )}
                </>
              )}
            </Box>
          ) : (
            <Box mt={4}>
              {/* 🔹 LOST FLOW */}
              {currentUserId && currentUserId !== item.postedBy?._id && !userClaim && (
                <>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h6" gutterBottom>
                    🕵️ Report You Found This
                  </Typography>

                  <Box
                    component="form"
                    onSubmit={claimFormik.handleSubmit}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{ py: 1.2 }}
                      color={claimFormik.touched.proofImage && claimFormik.errors.proofImage ? 'error' : 'primary'}
                    >
                      Upload image of found item
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => claimFormik.setFieldValue('proofImage', e.target.files[0])}
                      />
                    </Button>

                    {claimFormik.touched.proofImage && claimFormik.errors.proofImage && (
                      <Typography variant="caption" color="error">
                        {claimFormik.errors.proofImage}
                      </Typography>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ px: 3, py: 1 }}
                    >
                      Submit Found Report
                    </Button>
                  </Box>
                </>

              )}

              {userClaim && (
                <>
                  <Divider sx={{ my: 3 }} />

                  <Typography variant="h6" gutterBottom>
                    Your Submission
                  </Typography>

                  <Typography sx={{ mb: 1 }}>
                    Status:{' '}
                    <strong>{userClaim.isApproved ? 'Approved ✅' : 'Pending ⏳'}</strong>
                  </Typography>

                  {userClaim.isApproved && (
                    <Typography sx={{ mb: 1 }}>
                      Contact of Owner:{' '}
                      <strong>{item.postedBy?.phone}</strong>
                    </Typography>
                  )}

                  {userClaim.initiatedByLostPerson ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setProofImage(userClaim.lostClaimProofImage);
                          setOpenProofDialog(true);
                        }}
                        sx={{
                          alignSelf: 'flex-start',
                          textTransform: 'none',
                        }}
                      >
                        View Submitted Proof
                      </Button>

                      <Button
                        variant="contained"
                        onClick={() => handleApprove(userClaim._id)}
                        sx={{
                          alignSelf: 'flex-start',
                          textTransform: 'none',
                        }}
                      >
                        Approve Claim
                      </Button>
                    </Box>

                  ) : (
                    <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
                      No proof uploaded yet.
                    </Typography>
                  )}
                </>

              )}

              {currentUserId === item.postedBy?._id && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Typography variant="h6">People Who Found it</Typography>
                  {claims.length === 0 ? (
                    <Typography>No reports yet.</Typography>
                  ) : (
                    claims.map((claim) => (
                      <Paper key={claim._id} sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: 2 }}>
                        <Typography fontWeight={600}>
                          👤 {claim.claimedBy?.name}
                        </Typography>

                        {claim.proofImage && (
                          <Button
                            variant="outlined"
                            size="small"
                            sx={{ mt: 2 }}
                            onClick={() => {
                              setProofImage(claim.proofImage);
                              setOpenProofDialog(true);
                            }}
                          >
                            View Submitted Image
                          </Button>
                        )}

                        {claim.initiatedByLostPerson ?
                          <Typography
                            variant="body2"
                            color="warning.main"
                            sx={{ mt: 2 }}
                          >
                            🔄 Claim is in process – waiting for approval
                          </Typography>
                          : (!claim.isApproved && (
                            <Box
                              component="form"
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleInitiateClaim(claim._id);
                              }}
                              sx={{ mt: 3 }}
                            >
                              <Typography variant="body2" mb={1}>
                                Submit proof that this item belongs to you:
                              </Typography>

                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                <Button
                                  variant="outlined"
                                  component="label"
                                >
                                  Upload Proof
                                  <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) =>
                                      claimFormik.setFieldValue('proofImage', e.target.files[0])
                                    }
                                  />
                                </Button>

                                <Button type="submit" variant="contained">
                                  Initiate Claim
                                </Button>
                              </Box>
                            </Box>
                          ))}
                      </Paper>

                    ))
                  )}
                </>
              )}
            </Box>
          )}

          {/* Proof Image Dialog */}
          <Dialog open={openProofDialog} onClose={() => setOpenProofDialog(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Uploaded Proof</DialogTitle>
            <DialogContent>
              {proofImage ? (
                <img
                  src={`http://localhost:5000/uploads/${proofImage}`}
                  alt="Proof"
                  style={{ width: '100%', borderRadius: '8px' }}
                />
              ) : (
                <Typography>No proof image available.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenProofDialog(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      )}
    </Container>
  );
};

export default ItemDetails;